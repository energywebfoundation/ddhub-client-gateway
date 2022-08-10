import { DdhubLoginService } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { ChannelEntity } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Span } from 'nestjs-otel';
import { ChannelType } from '../../channel/channel.const';
import { ChannelService } from '../../channel/service/channel.service';
import { EventsGateway } from '../gateway/events.gateway';
import { WebSocketImplementation } from '../message.const';
import { GetMessageResponse } from '../message.interface';
import { EventEmitMode, MessageService } from './message.service';
import { WsClientService } from './ws-client.service';

enum SCHEDULER_HANDLERS {
  MESSAGES = 'ws-messages',
  MESSAGES_HEARTBEAT = 'ws-messages-heartbeat',
}

@Injectable()
export class DsbMessagePoolingService implements OnModuleInit {
  private readonly logger = new Logger(DsbMessagePoolingService.name);
  private readonly websocketMode = this.configService.get('WEBSOCKET', WebSocketImplementation.NONE);
  constructor(
    protected readonly ddhubLoginService: DdhubLoginService,
    protected readonly configService: ConfigService,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly messageService: MessageService,
    protected readonly channelService: ChannelService,
    protected readonly gateway: EventsGateway,
    protected readonly wsClient: WsClientService,
  ) { }

  public async onModuleInit(): Promise<void> {

    if (this.websocketMode === WebSocketImplementation.NONE) {
      this.logger.log(`Websockets are disabled, not polling messages`);

      return;
    }

    const callback = async () => {
      await this.handleInterval();
    };
    const timeout = setTimeout(callback, this.configService.get<number>('WEBSOCKET_POOLING_TIMEOUT', 5000));
    this.schedulerRegistry.addTimeout(SCHEDULER_HANDLERS.MESSAGES, timeout);

    this.logger.log('Enabling websockets');

  }

  @Span('ws_pool_messages')
  public async handleInterval(): Promise<void> {
    const callback = async () => {
      // handling callback polling msg
      this.logger.log("[handleInterval] handling callback polling msg");
      await this.handleInterval();
    };

    try {
      this.logger.log("[deleteTimeout] Start deleteTimeout");
      this.schedulerRegistry.deleteTimeout(SCHEDULER_HANDLERS.MESSAGES);
      this.logger.log("[deleteTimeout] End deleteTimeout");

      if (this.websocketMode === WebSocketImplementation.SERVER && this.gateway.server.clients.size === 0) {
        const timeout = setTimeout(callback, this.configService.get<number>('WEBSOCKET_POOLING_TIMEOUT', 5000));
        this.schedulerRegistry.addTimeout(SCHEDULER_HANDLERS.MESSAGES, timeout);
        this.logger.log(`${this.gateway.server.clients.size} client connected. Skip pooling trigger. waiting ${this.configService.get<number>('WEBSOCKET_POOLING_TIMEOUT', 5000)}`);
        return;
      }

      if (this.websocketMode === WebSocketImplementation.CLIENT && (this.wsClient.rws === undefined || (this.wsClient.rws !== undefined && this.wsClient.rws.readyState === this.wsClient.rws.CLOSED))) {
        if (this.wsClient.rws === undefined) {
          await this.wsClient.connect();
        }
        const timeout = setTimeout(callback, this.configService.get<number>('WEBSOCKET_POOLING_TIMEOUT', 5000));
        this.schedulerRegistry.addTimeout(SCHEDULER_HANDLERS.MESSAGES, timeout);
        this.logger.log(`Skip pooling trigger. waiting ${this.configService.get<number>('WEBSOCKET_POOLING_TIMEOUT', 5000)}`);
        return;
      }

      const subscriptions: ChannelEntity[] = (await this.channelService.getChannels()).filter((entity) => entity.type == ChannelType.SUB || entity.type == ChannelType.DOWNLOAD);

      if (subscriptions.length === 0) {
        this.logger.log(
          'No subscriptions found. Push messages are enabled when the DID is added to a channel'
        );

        const timeout = setTimeout(callback, this.configService.get<number>('WEBSOCKET_POOLING_TIMEOUT', 5000));
        this.schedulerRegistry.addTimeout(SCHEDULER_HANDLERS.MESSAGES, timeout);
        this.logger.log(`[no subscriptions] Waiting ${this.configService.get<number>('WEBSOCKET_POOLING_TIMEOUT', 5000)}`);
        return;
      }

      const msdCount = await this.pullMessagesAndEmit(subscriptions);
      if (msdCount == 0) {
        throw new Error(`empty msg, waiting to ` + this.configService.get<number>('WEBSOCKET_POOLING_TIMEOUT', 5000));
      }

      const timeout = setTimeout(callback, 1000); //immediate get msg available
      this.schedulerRegistry.addTimeout(SCHEDULER_HANDLERS.MESSAGES, timeout);
    } catch (e) {
      this.logger.error(e);
      const timeout = setTimeout(callback, this.configService.get<number>('WEBSOCKET_POOLING_TIMEOUT', 5000));
      this.schedulerRegistry.addTimeout(SCHEDULER_HANDLERS.MESSAGES, timeout);
      this.logger.log(`[exception caught] Waiting ${this.configService.get<number>('WEBSOCKET_POOLING_TIMEOUT', 5000)}`);
    }
  }

  private async pullMessagesAndEmit(subscriptions: ChannelEntity[]): Promise<number> {

    const websocketMode = this.configService.get('WEBSOCKET', WebSocketImplementation.NONE);
    let msgCount = 0;
    if (websocketMode === WebSocketImplementation.SERVER && this.gateway.server.clients.size > 0) {
      await this.ddhubLoginService.login();
      this.logger.log("[pullMessagesAndEmit] Start Promise.allSettled");
      await Promise.allSettled(
        Array.from(this.gateway.server.clients.values()).map(async (client) => {
          await this.pullMessages(subscriptions, client).then((totalMsg) => {
            msgCount += totalMsg;
          }).catch();
        })
      );
      this.logger.log("[pullMessagesAndEmit] End Promise.allSettled");
    } else if (this.wsClient.rws) {
      await this.ddhubLoginService.login();
      this.logger.log("[pullMessagesAndEmit] Start pullMessagesAndEmit");
      await this.pullMessages(subscriptions, this.wsClient.rws).then((totalMsg) => {
        msgCount += totalMsg;
      }).catch();
      this.logger.log("[pullMessagesAndEmit] End pullMessagesAndEmit");
    }

    return msgCount;
  }

  private async pullMessages(subscriptions: ChannelEntity[], client: any): Promise<number> {
    const clientId: string = this.configService.get<string>('CLIENT_ID', 'WS-CONSUMER');
    const messagesAmount: number = this.configService.get<number>('EVENTS_MAX_PER_SECOND', 2);

    const _clientId = new URLSearchParams(client.request?.url.split("?")[1]).get("clientId");

    let msgCount = 0;
    for (const subscription of subscriptions) {
      try {
        const messages: GetMessageResponse[] = await this.messageService.getMessages(
          {
            fqcn: subscription.fqcn,
            from: undefined,
            amount: messagesAmount,
            topicName: undefined,
            topicOwner: undefined,
            clientId: _clientId ? _clientId : clientId,
          }
        );

        this.logger.log(`Found ${messages.length} in ${subscription.fqcn} for ${_clientId ? _clientId : clientId}`);

        if (messages && messages.length > 0) {
          msgCount += messages.length;
          await this.sendMessagesToSubscribers(messages, subscription.fqcn, client);
        }
      } catch (e) {

        this.logger.error(`[WS][pullMessages] ${e}`);
      }

    }

    return msgCount;
  }

  public async sendMessagesToSubscribers(messages: GetMessageResponse[], fqcn: string, client: any): Promise<void> {
    try {
      const emitMode: EventEmitMode = this.configService.get('EVENTS_EMIT_MODE', EventEmitMode.BULK);

      if (emitMode === EventEmitMode.BULK) {
        if (client.readyState === WebSocket.OPEN) {
          const msg = JSON.stringify(messages.map((message) => ({ ...message, fqcn })));
          client.send(msg);
          this.logger.log(`[WS][sendMessagesToSubscribers][BULK] ${msg}`);
        }
      } else {
        messages.forEach((message: GetMessageResponse) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ ...message, fqcn }));
            this.logger.log(`[WS][sendMessagesToSubscribers][SINGLE] ${JSON.stringify({ ...message, fqcn })}`);
          }
        });
      }
    } catch (e) {
      this.logger.error(`[WS][sendMessagesToSubscribers] ${e}`);
    }
  }
}
