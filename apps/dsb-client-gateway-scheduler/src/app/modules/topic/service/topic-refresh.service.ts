import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import {
  ApplicationEntity,
  ApplicationWrapperRepository,
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
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TopicRefreshService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(TopicRefreshService.name);

  constructor(
    protected readonly wrapper: TopicRepositoryWrapper,
    protected readonly iamService: IamService,
    protected readonly applicationsWrapper: ApplicationWrapperRepository,
    protected readonly ddhubTopicsService: DdhubTopicsService,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly cronWrapper: CronWrapperRepository,
    protected readonly configService: ConfigService
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const isCronEnabled: boolean = this.configService.get<boolean>(
      'TOPICS_CRON_ENABLED',
      true
    );

    if (!isCronEnabled) {
      this.logger.warn(`Topics refresh cron job is disabled`);

      return;
    }

    const cronJob = new CronJob(
      this.configService.get<string>('TOPICS_CRON_SCHEDULE'),
      async () => {
        this.logger.log(`Executing topic refresh `);

        await this.refreshTopics();
      }
    );

    await this.schedulerRegistry.addCronJob(CronJobType.TOPIC_REFRESH, cronJob);

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

      this.logger.log('fetching all available applications');

      const applications: ApplicationEntity[] =
        await this.applicationsWrapper.repository.find();

      this.logger.log(`fetched ${applications.length} applications`);

      this.logger.log('clearing topics');
      await this.applicationsWrapper.repository.clear();

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
            const [major, minor, patch]: string[] =
              topicVersion.version.split('.');

            await this.wrapper.topicRepository.save({
              id: topic.id,
              owner: topic.owner,
              name: topic.name,
              schemaType: topic.schemaType,
              version: topicVersion.version,
              schema: topicVersion.schema,
              tags: topicVersion.tags,
              majorVersion: major,
              minorVersion: minor,
              patchVersion: patch,
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
