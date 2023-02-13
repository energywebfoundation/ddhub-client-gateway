import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  AssociationKeyEntity,
  ChannelEntity,
  CronJobType,
  CronWrapperRepository,
  TopicEntity,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ConfigService } from '@nestjs/config';
import { ChannelService } from '../../channel/service/channel.service';
import { TopicService } from '../../channel/service/topic.service';
import { MessageService } from './message.service';
import { AssociationKeysService } from '@dsb-client-gateway/ddhub-client-gateway-association-keys';
import promiseRetry from 'promise-retry';
import { RetryConfigService } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { CronJob } from 'cron';

interface AssociationKeyEntry {
  associationKey: string;
  validFrom: string;
  validTo: string;
}

type AssociationKeyPayload = AssociationKeyEntry[];

@Injectable()
export class AssociationKeysListener implements OnApplicationBootstrap {
  protected readonly logger = new Logger(AssociationKeysListener.name);

  constructor(
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly cronWrapper: CronWrapperRepository,
    protected readonly configService: ConfigService,
    protected readonly channelService: ChannelService,
    protected readonly topicService: TopicService,
    protected readonly messageService: MessageService,
    protected readonly associationKeyService: AssociationKeysService,
    protected readonly retryConfigService: RetryConfigService
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const isCronEnabled: boolean = this.configService.get<boolean>(
      'AK_SHARE_CRON_ENABLED',
      true
    );

    if (!isCronEnabled) {
      this.logger.warn(`Association keys share job is disabled`);

      return;
    }

    const cronJob = new CronJob(
      this.configService.get<string>('AK_SHARE_CRON_SCHEDULE'),
      async () => {
        this.logger.log(`Executing association keys share`);

        await this.execute();
      }
    );

    await this.schedulerRegistry.addCronJob(
      CronJobType.ASSOCIATION_KEYS_SHARE,
      cronJob
    );

    cronJob.start();
  }

  public async execute(forceSameKeys: boolean = false): Promise<void> {
    await this.run(forceSameKeys).catch((e) => {
      this.logger.error(
        'something went wrong when processing association keys'
      );
      this.logger.error(e);
    });
  }

  public async run(forceSameKeys: boolean = false): Promise<void> {
    const fqcn: string | undefined = this.configService.get<string>('AK_FQCN');
    const topicName: string | undefined =
      this.configService.get<string>('AK_TOPIC_NAME');
    const topicOwner: string | undefined =
      this.configService.get<string>('AK_TOPIC_OWNER');
    const topicVersion: string | undefined =
      this.configService.get<string>('AK_TOPIC_VERSION');

    if (!fqcn || !topicName || !topicOwner || !topicVersion) {
      this.logger.error(`some parameters are missing, not executing further`);

      return;
    }

    const channel: ChannelEntity | null = await this.channelService.getChannel(
      fqcn
    );

    if (!channel) {
      this.logger.error(
        `association key channel with fqcn ${fqcn} does not exists`
      );

      return;
    }

    if (channel.useAnonymousExtChannel) {
      this.logger.error(
        `channel with fqcn ${fqcn} must not have useAnonymousExtChannel set to true`
      );

      return;
    }

    if (!channel.payloadEncryption) {
      this.logger.error(
        `channel with fqcn ${fqcn} must have payloadEncryption set to true`
      );

      return;
    }

    const topic: TopicEntity | null = await this.topicService.getTopic(
      topicName,
      topicOwner,
      topicVersion
    );

    if (!topic) {
      this.logger.error(`association key topic does not exists`);

      return;
    }

    await this.sendKeys(channel, topic, forceSameKeys);
  }

  private async sendKeys(
    channel: ChannelEntity,
    topic: TopicEntity,
    forceSameKeys: boolean = false
  ): Promise<void> {
    const keysNotSent: AssociationKeyEntity[] = forceSameKeys
      ? await this.associationKeyService.getCurrentAndNext().then((result) => {
          return [result.current, result.next].filter(Boolean);
        })
      : await this.associationKeyService.getNotSharedKeys();

    const payload: AssociationKeyPayload = keysNotSent.map(
      (associationKey: AssociationKeyEntity) => ({
        associationKey: associationKey.associationKey,
        validTo: associationKey.validTo.toISOString(),
        validFrom: associationKey.validFrom.toISOString(),
      })
    );

    if (payload.length === 0) {
      this.logger.debug(`no association keys to share`);

      return;
    }

    await promiseRetry(async (retry, number) => {
      this.logger.log(`attempting to send association keys #${number}`);

      await this.messageService
        .sendMessage({
          fqcn: channel.fqcn,
          topicOwner: topic.owner,
          topicVersion: topic.version,
          topicName: topic.name,
          payload: JSON.stringify(payload),
          anonymousRecipient: undefined,
          transactionId: undefined,
        })
        .then(async () => {
          return this.associationKeyService
            .updateKeySharedState(
              payload.map(({ associationKey }) => associationKey)
            )
            .catch((e) => retry(e));
        })
        .catch((e) => {
          this.logger.error('failed when sending association keys');
          this.logger.error(e);

          return retry(e);
        });
    }, this.retryConfigService.loginConfig);
  }
}
