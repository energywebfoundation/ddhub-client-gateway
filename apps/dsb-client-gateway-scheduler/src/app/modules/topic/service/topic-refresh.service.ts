import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import {
  ApplicationEntity,
  ApplicationWrapperRepository,
  CronJobType,
  CronStatus,
  CronWrapperRepository,
  TopicMonitorEntity,
  TopicMonitorRepositoryWrapper,
  TopicRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import {
  DdhubTopicsService,
  TopicDataResponse,
  TopicMonitorUpdates,
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
    protected readonly configService: ConfigService,
    protected readonly topicMonitorWrapper: TopicMonitorRepositoryWrapper
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

      if (applications.length === 0) {
        this.logger.log('no applications');

        return;
      }

      const applicationsToCheck: string[] = await this.computeOwners(
        applications.map((app) => app.namespace)
      );

      if (applicationsToCheck.length === 0) {
        this.logger.log('no applications to run');

        await this.cronWrapper.cronRepository.save({
          jobName: CronJobType.TOPIC_REFRESH,
          latestStatus: CronStatus.SUCCESS,
          executedAt: new Date(),
        });

        return;
      }

      const applicationsToRun: ApplicationEntity[] = this.getApplicationsToRun(
        applicationsToCheck,
        applications
      );

      for (const application of applicationsToRun) {
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

  private getApplicationsToRun(
    applicationsToRun: string[],
    applications: ApplicationEntity[]
  ): ApplicationEntity[] {
    return applicationsToRun.reduce((acc, curr) => {
      const application: ApplicationEntity | undefined = applications.find(
        (app: ApplicationEntity) => app.namespace === curr
      );

      if (!application) {
        return acc;
      }

      acc.push(application);

      return acc;
    }, []);
  }

  protected async computeOwners(allOwners: string[]): Promise<string[]> {
    const topicUpdatesMonitor: TopicMonitorUpdates[] =
      await this.ddhubTopicsService.topicUpdatesMonitor(allOwners);

    if (topicUpdatesMonitor.length === 0) {
      this.logger.warn('no topic monitors received from MB');

      return allOwners;
    }

    const existingTopicsMonitors: TopicMonitorEntity[] =
      await this.topicMonitorWrapper.topicRepository.get(allOwners);

    if (existingTopicsMonitors.length === 0) {
      this.logger.warn('no previously stored monitors');

      await Promise.all(
        topicUpdatesMonitor.map((topicMonitor: TopicMonitorUpdates) =>
          this.saveMonitor(topicMonitor)
        )
      );

      return allOwners;
    }

    const ownersToReturn: string[] = [];

    for (const topicMonitor of topicUpdatesMonitor) {
      const matchingElement: TopicMonitorEntity | undefined =
        existingTopicsMonitors.find(
          (topicMonitor: TopicMonitorEntity) =>
            topicMonitor.owner === topicMonitor.owner
        );

      if (!matchingElement) {
        ownersToReturn.push(topicMonitor.owner);

        this.logger.log(
          `${topicMonitor.owner} monitor first time stored in database`
        );

        await this.saveMonitor(topicMonitor);
      }

      if (
        matchingElement.lastTopicVersionUpdate >
          topicMonitor.lastTopicVersionUpdate ||
        matchingElement.lastTopicUpdate > topicMonitor.lastTopicUpdate
      ) {
        ownersToReturn.push(topicMonitor.owner);

        this.logger.log(`${topicMonitor.owner} monitor updated`);

        await this.saveMonitor(topicMonitor);
      }
    }

    return ownersToReturn;
  }

  protected async saveMonitor(mb: TopicMonitorUpdates): Promise<void> {
    await this.topicMonitorWrapper.topicRepository.save({
      owner: mb.owner,
      lastTopicUpdate: mb.lastTopicUpdate,
      lastTopicVersionUpdate: mb.lastTopicVersionUpdate,
    });
  }
}
