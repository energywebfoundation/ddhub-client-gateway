import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { DsbApiService } from './dsb-api.service';
import { Channel, Message } from '../dsb-client.interface';
import { Enrolment } from '@dsb-client-gateway/dsb-client-gateway/identity/models';
import { ConfigService } from '@nestjs/config';
import { WebSocketImplementation } from '../../message/message.const';
import { MessageService } from '../../message/service/message.service';
import { EnrolmentRepository } from '../../storage/repository/enrolment.repository';

enum SCHEDULER_HANDLERS {
  MESSAGES = 'messages',
}

@Injectable()
export class DsbMessagePoolingService implements OnModuleInit {
  private readonly logger = new Logger(DsbMessagePoolingService.name);

  constructor(
    protected readonly dsbApiService: DsbApiService,
    protected readonly enrolmentRepository: EnrolmentRepository,
    protected readonly configService: ConfigService,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly messageService: MessageService
  ) {}

  public async onModuleInit(): Promise<void> {
    const websocketMode = this.configService.get(
      'WEBSOCKET',
      WebSocketImplementation.NONE
    );

    if (websocketMode === WebSocketImplementation.NONE) {
      this.logger.log(`Websockets are disabled, not polling messages`);

      return;
    }

    this.logger.log('Enabling websockets');

    const callback = async () => {
      await this.handleInterval();
    };

    const timeout = setTimeout(callback, 5000);

    this.schedulerRegistry.addTimeout(SCHEDULER_HANDLERS.MESSAGES, timeout);
  }

  public async handleInterval(): Promise<void> {
    const callback = async () => {
      await this.handleInterval();
    };

    try {
      this.schedulerRegistry.deleteTimeout(SCHEDULER_HANDLERS.MESSAGES);

      const enrolment: Enrolment | null =
        this.enrolmentRepository.getEnrolment();

      const isEnrolmentValid: boolean = this.validateEnrolment(enrolment);

      if (!isEnrolmentValid) {
        this.logger.error('User not enrolled, waiting for enrolment');

        const timeout = setTimeout(callback, 60000);

        this.schedulerRegistry.addTimeout(SCHEDULER_HANDLERS.MESSAGES, timeout);

        return;
      }

      const subscriptions: Channel[] = await this.getSubscribedChannels(
        enrolment.did
      );

      if (subscriptions.length === 0) {
        this.logger.log(
          'No subscriptions found. Push messages are enabled when the DID is added to a channel'
        );

        const timeout = setTimeout(callback, 60000);

        this.schedulerRegistry.addTimeout(SCHEDULER_HANDLERS.MESSAGES, timeout);

        return;
      }

      await this.pullMessagesAndEmit(subscriptions);
    } catch (e) {
      this.logger.error(e);
    } finally {
      const timeout = setTimeout(callback, 1000);

      this.schedulerRegistry.addTimeout(SCHEDULER_HANDLERS.MESSAGES, timeout);
    }
  }

  private async pullMessagesAndEmit(subscriptions: Channel[]): Promise<void> {
    const clientId: string = this.configService.get<string>(
      'CLIENT_ID',
      'WS_CONSUMER'
    );
    const messagesAmount: number = this.configService.get<number>(
      'EVENTS_MAX_PER_SECOND',
      2
    );

    for (const subscription of subscriptions) {
      const messages: Message[] = await this.dsbApiService.getMessages(
        subscription.fqcn,
        undefined,
        clientId,
        messagesAmount
      );

      this.logger.log(`Found ${messages.length} in ${subscription.fqcn}`);

      if (messages && messages.length > 0) {
        await this.messageService.sendMessagesToSubscribers(
          messages,
          subscription.fqcn
        );
        // const emitMode: EventEmitMode = this.configService.get(
        //   'EVENT_EMIT_MODE',
        //   EventEmitMode.BULK
        // );
        // this.eventsGateway.server.emit('messages', {});
      }
    }
  }

  private async getSubscribedChannels(did: string): Promise<Channel[]> {
    const channels: Channel[] = await this.dsbApiService.getChannels();

    return channels.filter(({ subscribers }) =>
      subscribers ? subscribers?.includes(did) : true
    );
  }

  private validateEnrolment(enrolment: Enrolment | null): boolean {
    return !!enrolment?.state.approved;
  }
}
