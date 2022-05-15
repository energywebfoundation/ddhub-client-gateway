import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import {
  CronJobType,
  CronStatus,
  CronWrapperRepository,
  TopicRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import {
  DdhubTopicsService,
  TopicDataResponse,
  TopicVersionResponse,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Span } from 'nestjs-otel';

@Injectable()
export class TopicRefreshService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(TopicRefreshService.name);

  constructor(
    protected readonly wrapper: TopicRepositoryWrapper,
    protected readonly iamService: IamService,
    protected readonly ddhubTopicsService: DdhubTopicsService,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly cronWrapper: CronWrapperRepository
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const cronJob = new CronJob(`*/1 * * * *`, async () => {
      this.logger.log(`Executing topic refresh `);

      await this.refreshTopics();
    });

    await this.schedulerRegistry.addCronJob('refresh_topics', cronJob);

    cronJob.start();
  }

  @Span('topic_refresh')
  public async refreshTopics(): Promise<void> {
    try {
      const isInitialized: boolean = this.iamService.isInitialized();

      if (!isInitialized) {
        this.logger.error(`IAM is not initialized. Please setup private key`);

        return;
      }

      await this.wrapper.topicRepository.clear();

      this.logger.log('fetching all available applications');

      const applications = await this.iamService.getApplicationsByOwnerAndRole(
        'user',
        this.iamService.getDIDAddress()
      );

      this.logger.log(`fetched ${applications.length} applications`);

      for (const application of applications) {
        const topicsForApplication: TopicDataResponse =
          await this.ddhubTopicsService.getTopics(
            100,
            undefined,
            application.namespace,
            1,
            []
          );

        for (const topic of topicsForApplication.records) {
          const topicVersions: TopicVersionResponse =
            await this.ddhubTopicsService.getTopicVersions(topic.id);

          for (const topicVersion of topicVersions.records) {
            await this.wrapper.topicRepository.save({
              id: topic.id,
              owner: topic.owner,
              name: topic.name,
              schemaType: topic.schemaType,
              version: topicVersion.version,
              schema: topicVersion.schema,
              tags: topicVersion.tags,
            });

            this.logger.log(
              `stored topic with name ${topicVersion.name} and owner ${topicVersion.owner} with version ${topicVersion.version}`
            );
          }
        }
      }

      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.TOPIC_REFRESH,
        latestStatus: CronStatus.SUCCESS,
        executedAt: new Date(),
      });
    } catch (e) {
      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.TOPIC_REFRESH,
        latestStatus: CronStatus.FAILED,
        executedAt: new Date(),
      });

      this.logger.error('refresh topics failed', e);
    }
  }
}
