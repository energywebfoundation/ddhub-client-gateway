import {
  AckResponse,
  DdhubLoginService,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import {
  AcksEntity,
  AcksWrapperRepository,
  ChannelEntity,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import moment from 'moment';
import { In } from 'typeorm';
import { ChannelType } from '../../channel/channel.const';
import { ChannelService } from '../../channel/service/channel.service';
import { EventsGateway } from '../gateway/events.gateway';
import { WebSocketImplementation } from '../message.const';
import { GetMessageResponse } from '../message.interface';
import { EventEmitMode, MessageService } from './message.service';
import { WsClientService } from './ws-client.service';
import { PinoLogger } from 'nestjs-pino';
import { storage, Store } from 'nestjs-pino/storage.js';
import { v4 as uuidv4 } from 'uuid';
import type { queue } from 'fastq';
import * as fastq from 'fastq';
import { ClientsService } from '@dsb-client-gateway/ddhub-client-gateway-clients';

export interface Task {
  id: string;
}

@Injectable()
export class DsbMessagePoolingService implements OnApplicationBootstrap {
  private queue: queue<Task>;
  private store;
  private readonly logger = new Logger(DsbMessagePoolingService.name);
  private readonly websocketMode = this.configService.get(
    'WEBSOCKET',
    WebSocketImplementation.NONE
  );
  constructor(
    protected readonly ddhubLoginService: DdhubLoginService,
    protected readonly configService: ConfigService,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly messageService: MessageService,
    protected readonly channelService: ChannelService,
    protected readonly gateway: EventsGateway,
    protected readonly wsClient: WsClientService,
    protected readonly acksWrapperRepository: AcksWrapperRepository,
    protected readonly pinoLogger: PinoLogger,
    protected readonly clientsService: ClientsService
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    if (this.websocketMode === WebSocketImplementation.NONE) {
      this.logger.log(`Websockets are disabled, not polling messages`);

      return;
    }

    const handler = async (task: Task) => {
      await this.worker(task);
    };

    this.store = new Store(PinoLogger.root);
    this.queue = fastq.promise(async (task: Task) => {
      await this.worker(task);
    }, 1);

    this.logger.log('Running websockets');

    this.queue.push({
      id: uuidv4(),
    });
  }

  protected async sleepAndIterate(ms: number): Promise<void> {
    await new Promise((r) => setTimeout(r, ms));

    this.queue.push({
      id: uuidv4(),
    });
  }

  protected async worker(task: Task): Promise<void> {
    try {
      await storage.run(this.store, async () => {
        this.store.logger = PinoLogger.root;

        this.pinoLogger.assign({
          runId: task.id,
        });

        await this.handleTask();

        this.logger.log(`run id ${task.id}`);
      });
    } catch (e) {
      this.logger.error(`ws worker failed`);
      this.logger.error(e);
    }
    // this.store.logger[Object.getOwnPropertySymbols(this.store.logger)[2]] = '';

    this.store.logger = null;
    storage.disable();
  }

  protected async handleTask(): Promise<void> {
    try {
      if (
        this.websocketMode === WebSocketImplementation.SERVER &&
        this.gateway.server.clients.size === 0
      ) {
        this.logger.log(
          `${
            this.gateway.server.clients.size
          } client connected. Skip pooling trigger. waiting ${this.configService.get<number>(
            'WEBSOCKET_POOLING_TIMEOUT',
            5000
          )}`
        );

        await this.sleepAndIterate(
          this.configService.get<number>('WEBSOCKET_POOLING_TIMEOUT', 5000)
        );

        return;
      }

      if (
        this.websocketMode === WebSocketImplementation.CLIENT &&
        (this.wsClient.rws === undefined ||
          (this.wsClient.rws !== undefined &&
            this.wsClient.rws.readyState === this.wsClient.rws.CLOSED))
      ) {
        if (this.wsClient.rws === undefined) {
          await this.wsClient.connect();
        }

        this.logger.log(
          `Skip pooling trigger. waiting ${this.configService.get<number>(
            'WEBSOCKET_POOLING_TIMEOUT',
            5000
          )}`
        );

        await this.sleepAndIterate(
          this.configService.get<number>('WEBSOCKET_POOLING_TIMEOUT', 5000)
        );

        return;
      }

      const subscriptions: ChannelEntity[] = (
        await this.channelService.getChannels()
      ).filter(
        (entity) =>
          entity.type == ChannelType.SUB || entity.type == ChannelType.DOWNLOAD
      );

      if (subscriptions.length === 0) {
        this.logger.log(
          'No subscriptions found. Push messages are enabled when the DID is added to a channel'
        );

        this.logger.log(
          `[no subscriptions] Waiting ${this.configService.get<number>(
            'WEBSOCKET_POOLING_TIMEOUT',
            5000
          )}`
        );

        await this.sleepAndIterate(
          this.configService.get<number>('WEBSOCKET_POOLING_TIMEOUT', 5000)
        );

        return;
      }

      const msdCount = await this.pullMessagesAndEmit(subscriptions);
      if (msdCount == 0) {
        throw new Error(
          `empty msg, waiting to ` +
            this.configService.get<number>('WEBSOCKET_POOLING_TIMEOUT', 5000)
        );
      }

      await this.sleepAndIterate(1000);

      return;
    } catch (e) {
      this.logger.error(e);
      this.logger.error(
        `[exception caught] Waiting ${this.configService.get<number>(
          'WEBSOCKET_POOLING_TIMEOUT',
          5000
        )}`
      );

      await this.sleepAndIterate(
        this.configService.get<number>('WEBSOCKET_POOLING_TIMEOUT', 5000)
      );
    }
  }

  private async pullMessagesAndEmit(
    subscriptions: ChannelEntity[]
  ): Promise<number> {
    const websocketMode = this.configService.get(
      'WEBSOCKET',
      WebSocketImplementation.NONE
    );
    let msgCount = 0;
    if (
      websocketMode === WebSocketImplementation.SERVER &&
      this.gateway.server.clients.size > 0
    ) {
      this.logger.log('[pullMessagesAndEmit] Start Promise.allSettled');
      await Promise.allSettled(
        Array.from(this.gateway.server.clients.values()).map(async (client) => {
          await this.pullMessages(subscriptions, client)
            .then((totalMsg) => {
              msgCount += totalMsg;
            })
            .catch((e) => {
              this.logger.error(e);
            });
        })
      );
      this.logger.log('[pullMessagesAndEmit] End Promise.allSettled');
    } else if (this.wsClient.rws) {
      this.logger.log('[pullMessagesAndEmit] Start pullMessagesAndEmit');
      await this.pullMessages(subscriptions, this.wsClient.rws)
        .then((totalMsg) => {
          msgCount += totalMsg;
        })
        .catch((e) => {
          this.logger.error(e);
        });
      this.logger.log('[pullMessagesAndEmit] End pullMessagesAndEmit');
    }

    return msgCount;
  }

  private async pullMessages(
    subscriptions: ChannelEntity[],
    client
  ): Promise<number> {
    const defaultClientId: string = this.configService.get<string>(
      'CLIENT_ID',
      'WS-CONSUMER'
    );
    const messagesAmount: number = this.configService.get<number>(
      'EVENTS_MAX_PER_SECOND',
      2
    );

    const urlSearchParams = new URLSearchParams(
      client.request?.url.split('?')[1]
    );

    const validClientId: string =
      urlSearchParams.get('clientId') ?? defaultClientId;

    this.logger.log(`using client ${validClientId}`);

    const subscribedChannels: string | undefined =
      urlSearchParams.get('channels');

    const splittedChannels: string[] = subscribedChannels
      ? subscribedChannels.split(',')
      : [];

    const channelsToIterate: ChannelEntity[] =
      splittedChannels.length > 0
        ? subscriptions.filter((channel: ChannelEntity) =>
            splittedChannels.includes(channel.fqcn)
          )
        : subscriptions;

    this.logger.debug(`using channels`);
    this.logger.debug(subscribedChannels);

    if (
      splittedChannels.length !== channelsToIterate.length &&
      splittedChannels.length > 0
    ) {
      this.logger.warn('some passed channels do not exists');

      const invalidChannels: string[] = channelsToIterate
        .filter((channel) => !splittedChannels.includes(channel.fqcn))
        .map((channel) => channel.fqcn);

      this.logger.warn(invalidChannels);
    }

    await this.clientsService.upsert(validClientId);

    let msgCount = 0;
    for (const subscription of channelsToIterate) {
      try {
        const messages: GetMessageResponse[] =
          await this.messageService.getMessagesWithReqLock(
            {
              fqcn: subscription.fqcn,
              from: undefined,
              amount: messagesAmount,
              topicName: undefined,
              topicOwner: undefined,
              clientId: validClientId,
            },
            false
          );

        this.logger.log(
          `Found ${messages.length} in ${subscription.fqcn} for ${validClientId}`
        );

        if (messages && messages.length > 0) {
          msgCount += messages.length;
          await this.sendMessagesToSubscribers(
            messages,
            subscription.fqcn,
            client,
            `${validClientId}:${subscription.fqcn}`
          );
        }
      } catch (e) {
        this.logger.error(`[WS][pullMessages] ${e}`);
      }
    }

    return msgCount;
  }

  public async sendMessagesToSubscribers(
    messages: GetMessageResponse[],
    fqcn: string,
    client,
    clientId: string
  ): Promise<void> {
    try {
      const emitMode: EventEmitMode = this.configService.get(
        'EVENTS_EMIT_MODE',
        EventEmitMode.BULK
      );
      const data: AcksEntity[] =
        await this.acksWrapperRepository.acksRepository.find({
          where: {
            clientId,
          },
        });
      const idsNotAckVerify: string[] = data.map((e) => e.messageId);
      const _messages = messages.filter((e) => !idsNotAckVerify.includes(e.id));
      if (emitMode === EventEmitMode.BULK) {
        if (client.readyState === WebSocket.OPEN && _messages.length > 0) {
          if (_messages.length > 0) {
            const msg = JSON.stringify(
              _messages.map((message) => ({ ...message, fqcn }))
            );
            client.send(msg);
            this.logger.log(`[WS][sendMessagesToSubscribers][BULK] ${msg}`);
          }
        }
      } else {
        _messages.forEach((message: GetMessageResponse) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ ...message, fqcn }));
            this.logger.log(
              `[WS][sendMessagesToSubscribers][SINGLE] ${JSON.stringify({
                ...message,
                fqcn,
              })}`
            );
          }
        });
      }
      const successAckMessageIds: AckResponse = await this.messageService
        .sendAckBy(
          _messages.map((message) => message.id).concat(idsNotAckVerify),
          clientId,
          null
        )
        .catch((e) => {
          this.logger.warn(`[WS][sendMessagesToSubscribers][sendAckBy] ${e}`);
          this.logger.warn(e);
          return {
            acked: [],
            notFound: [],
          };
        });
      const idsNotAck: AcksEntity[] = messages
        .filter((e) => !successAckMessageIds.acked.includes(e.id))
        .map((e) => {
          return {
            clientId: clientId,
            messageId: e.id,
            mbTimestamp: moment(e.timestampNanos / (1000 * 1000))
              .utc()
              .toDate(),
          };
        });

      if (idsNotAck.length > 0) {
        await this.acksWrapperRepository.acksRepository.save(idsNotAck);
      }

      const deleteAckMessageIds = idsNotAckVerify.filter((e) =>
        successAckMessageIds.acked.includes(e)
      );
      if (deleteAckMessageIds.length > 0) {
        await this.acksWrapperRepository.acksRepository.delete({
          messageId: In(deleteAckMessageIds),
          clientId,
        });
      }
    } catch (e) {
      this.logger.error(`[WS][sendMessagesToSubscribers]`);
      this.logger.error(e);
    }
  }
}
