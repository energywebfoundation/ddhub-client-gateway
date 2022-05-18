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
import { MessageService } from './message.service';
import { WsClientService } from './ws-client.service';

enum SCHEDULER_HANDLERS {
  MESSAGES = 'ws-messages',
}

@Injectable()
export class DsbMessagePoolingService implements OnModuleInit {
  private readonly logger = new Logger(DsbMessagePoolingService.name);

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
    const websocketMode = this.configService.get(
      'WEBSOCKET',
      WebSocketImplementation.NONE
    );

    if (websocketMode === WebSocketImplementation.NONE) {
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
      await this.handleInterval();
    };

    const websocketMode = this.configService.get(
      'WEBSOCKET',
      WebSocketImplementation.NONE
    );
    try {
      this.schedulerRegistry.deleteTimeout(SCHEDULER_HANDLERS.MESSAGES);

      if (websocketMode === WebSocketImplementation.SERVER && this.gateway.server.clients.size === 0) {
        const timeout = setTimeout(callback, this.configService.get<number>('WEBSOCKET_POOLING_TIMEOUT', 5000));
        this.schedulerRegistry.addTimeout(SCHEDULER_HANDLERS.MESSAGES, timeout);
        return;
      }

      if (websocketMode === WebSocketImplementation.CLIENT && (this.wsClient.rws === undefined || (this.wsClient.rws !== undefined && this.wsClient.rws.readyState === this.wsClient.rws.CLOSED))) {
        if (this.wsClient.rws === undefined) {
          await this.wsClient.connect();
        }
        const timeout = setTimeout(callback, this.configService.get<number>('WEBSOCKET_POOLING_TIMEOUT', 5000));
        this.schedulerRegistry.addTimeout(SCHEDULER_HANDLERS.MESSAGES, timeout);
        return;
      }

      const subscriptions: ChannelEntity[] = await (await this.channelService.getChannels()).filter((entity) => entity.type == ChannelType.SUB);

      if (subscriptions.length === 0) {
        this.logger.log(
          'No subscriptions found. Push messages are enabled when the DID is added to a channel'
        );

        const timeout = setTimeout(callback, this.configService.get<number>('WEBSOCKET_POOLING_TIMEOUT', 5000) * 12);
        this.schedulerRegistry.addTimeout(SCHEDULER_HANDLERS.MESSAGES, timeout);

        return;
      }

      await this.ddhubLoginService.login().catch((e) => {
        this.logger.error(`Login failed`, e);
        const timeout = setTimeout(callback, this.configService.get<number>('WEBSOCKET_POOLING_TIMEOUT', 5000));
        this.schedulerRegistry.addTimeout(SCHEDULER_HANDLERS.MESSAGES, timeout);
        return;
      });

      await this.pullMessagesAndEmit(subscriptions);

      const timeout = setTimeout(callback, this.configService.get<number>('WEBSOCKET_POOLING_TIMEOUT', 5000) / 5);
      this.schedulerRegistry.addTimeout(SCHEDULER_HANDLERS.MESSAGES, timeout);
    } catch (e) {
      this.logger.error(e);
      const timeout = setTimeout(callback, this.configService.get<number>('WEBSOCKET_POOLING_TIMEOUT', 5000) * 12);
      this.schedulerRegistry.addTimeout(SCHEDULER_HANDLERS.MESSAGES, timeout);
    }
  }

  private async pullMessagesAndEmit(subscriptions: ChannelEntity[]): Promise<void> {
    const clientId: string = this.configService.get<string>(
      'CLIENT_ID',
      'WS-CONSUMER'
    );
    const messagesAmount: number = this.configService.get<number>(
      'EVENTS_MAX_PER_SECOND',
      2
    );

    let emptyMsg = 0;

    for (const subscription of subscriptions) {
      const messages: GetMessageResponse[] = await this.messageService.getMessages({
        fqcn: subscription.fqcn,
        from: undefined,
        amount: messagesAmount,
        topicName: undefined,
        topicOwner: undefined,
        clientId,
      }
      );

      this.logger.log(`Found ${messages.length} in ${subscription.fqcn}`);

      if (messages && messages.length > 0) {
        emptyMsg += messages.length;
        await this.messageService.sendMessagesToSubscribers(
          messages,
          subscription.fqcn
        );
      }
    }
    if (emptyMsg == 0) throw new Error("Channel sub is empty");
  }
}
