import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import {
  ChannelEntity,
  ChannelWrapperRepository,
  CronJobType,
  CronStatus,
  CronWrapperRepository,
  TopicEntity,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ChannelType } from '../../channel/channel.const';
import { MessageService } from './message.service';
import { GetMessageResponse } from '../message.interface';
import { MessageStoreService } from './message-store.service';
import moment from 'moment/moment';
import { TopicService } from '../../channel/service/topic.service';

@Injectable()
export class MessageListenerService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(MessageListenerService.name);

  constructor(
    protected readonly configService: ConfigService,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly cronWrapper: CronWrapperRepository,
    protected readonly channelWrapper: ChannelWrapperRepository,
    protected readonly messageService: MessageService,
    protected readonly messageStoreService: MessageStoreService,
    protected readonly topicService: TopicService
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const isCronEnabled: boolean = this.configService.get<boolean>(
      'FETCH_MESSAGES_CRON_ENABLED',
      true
    );

    if (!isCronEnabled) {
      this.logger.warn(`Fetch messages cron job is disabled`);

      return;
    }

    const cronJob = new CronJob(
      this.configService.get<string>('FETCH_MESSAGES_CRON_SCHEDULE'),
      async () => {
        this.logger.log(`Executing messages fetch`);

        await this.execute();
      }
    );

    this.schedulerRegistry.addCronJob(CronJobType.MESSAGES_FETCH, cronJob);

    cronJob.start();
  }

  public async execute(): Promise<void> {
    try {
      const applicableChannels: ChannelEntity[] =
        await this.channelWrapper.fetch({
          type: ChannelType.SUB,
          messageForms: true,
        });

      if (applicableChannels.length === 0) {
        this.logger.debug(`no applicable channels`);

        return;
      }

      const messagesToFetch = this.configService.get<number>(
        'FETCH_MESSAGES_CRON_AMOUNT',
        30
      );

      const clientId = this.configService.get<string>(
        'FETCH_MESSAGES_CRON_CLIENT_ID',
        'fetch-message'
      );

      for (const channel of applicableChannels) {
        for (const channelTopic of channel.conditions.topics) {
          const messages: GetMessageResponse[] =
            await this.messageService.getMessages(
              {
                amount: messagesToFetch,
                fqcn: channel.fqcn,
                clientId,
                topicName: channelTopic.topicName,
                topicOwner: channelTopic.owner,
                from: undefined,
              },
              true,
              true
            );

          this.logger.log(
            `received ${messages.length} messages for channel ${channel.fqcn} and topic ${channelTopic.topicName}.${channelTopic.owner}`
          );

          await this.messageStoreService
            .storeReceivedMessage(
              await Promise.all(
                messages.map(async (messageResponse: GetMessageResponse) => {
                  this.logger.log(messageResponse);

                  const topic: TopicEntity | undefined =
                    await this.topicService.getTopic(
                      channelTopic.topicName,
                      channelTopic.owner
                    );

                  return {
                    topic,
                    fqcn: channel.fqcn,
                    initiatingMessageId: messageResponse.initiatingMessageId,
                    initiatingTransactionId:
                      messageResponse.initiatingTransactionId,
                    payload: messageResponse.payload,
                    transactionId: messageResponse.transactionId,
                    payloadEncryption: messageResponse.payloadEncryption,
                    clientGatewayMessageId:
                      messageResponse.clientGatewayMessageId,
                    messageId: messageResponse.id,
                    senderDid: messageResponse.sender,
                    signature: messageResponse.signature,
                    isFile: false,
                    timestampNanos: moment(
                      messageResponse.timestampNanos / (1000 * 1000)
                    )
                      .utc()
                      .toDate(),
                    topicVersion: topic.version,
                  };
                })
              )
            )
            .catch((e) => {
              this.logger.error(`failed to store received messages`);
              this.logger.error(e);
            });
        }
      }

      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.MESSAGES_FETCH,
        latestStatus: CronStatus.SUCCESS,
        executedAt: new Date(),
      });
    } catch (e) {
      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.MESSAGES_FETCH,
        latestStatus: CronStatus.FAILED,
        executedAt: new Date(),
      });

      this.logger.error('fetch messages failed');
      this.logger.error(e);
    }
  }
}
