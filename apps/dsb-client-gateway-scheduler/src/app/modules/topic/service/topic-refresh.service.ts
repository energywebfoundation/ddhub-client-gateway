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
import { CommandBus } from '@nestjs/cqrs';
import moment from 'moment';
import { TopicDeletedCommand } from '../../channel/command/topic-deleted.command';

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
    protected readonly commandBus: CommandBus,
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

      const [applicationsToCheck, topicMonitors]: [
        string[],
        TopicMonitorUpdates[]
      ] = await this.computeOwners(applications.map((app) => app.namespace));

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
        const matchingTopicMonitor: TopicMonitorUpdates | undefined =
          topicMonitors.find(
            ({ owner }: TopicMonitorUpdates) =>
              (owner) =>
                application.namespace
          );

        await this.handleApplications(application, matchingTopicMonitor);
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

  private async handleApplications(
    application: ApplicationEntity,
    monitor?: TopicMonitorUpdates
  ): Promise<void> {
    this.logger.log(`running application ${application.namespace}`);

    let page = 1;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const topicsForApplication: TopicDataResponse =
        await this.ddhubTopicsService
          .getTopics(50, application.namespace, page, true)
          .catch((e) => {
            this.logger.error(`fetching topics failed`, {
              error: e,
              appNamespace: application.namespace,
            });

            page++;

            return {
              count: 0,
              page: 0,
              records: [],
              limit: 0,
            };
          });

      if (topicsForApplication.records.length === 0) {
        break;
      }

      // iterate over topics
      for (const topic of topicsForApplication.records) {
        // if the topic is deleted, delete it from database
        if (topic.deleted) {
          this.logger.log(`${topic.id} got deleted`);

          await this.wrapper.topicRepository.delete({
            owner: topic.owner,
            name: topic.name,
            id: topic.id,
          });

          await this.commandBus.execute(
            new TopicDeletedCommand(topic.name, topic.owner, topic.id)
          );

          continue;
        }

        this.logger.log(
          `attempting to fetch topic versions of ${topic.name} and ${topic.owner}`
        );

        // receive topic versions using it's id
        const topicVersions: TopicVersionResponse =
          await this.ddhubTopicsService.getTopicVersions(topic.id);

        // iterate over topic versions
        for (const topicVersion of topicVersions.records) {
          if (topicVersion.deleted) {
            await this.wrapper.topicRepository.delete({
              version: topicVersion.version,
              name: topicVersion.name,
              owner: topicVersion.owner,
              id: topic.id,
            });

            this.logger.log(
              `deleted topic ${topicVersion.version} ${topicVersion.name} ${topicVersion.owner}`
            );

            continue;
          }

          if (
            topic.owner !== topicVersion.owner ||
            topic.name !== topicVersion.name
          ) {
            this.logger.error(`mismatch between topic version and topic`, {
              topic: {
                owner: topic.owner,
                name: topic.name,
              },
              version: {
                owner: topicVersion.owner,
                name: topicVersion.name,
              },
            });
          }

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

      page++;
    }

    if (monitor) {
      await this.saveMonitor(monitor);
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

  protected async computeOwners(
    allOwners: string[]
  ): Promise<[string[], TopicMonitorUpdates[]]> {
    const topicUpdatesMonitor: TopicMonitorUpdates[] =
      await this.ddhubTopicsService.topicUpdatesMonitor(allOwners);

    this.logger.log(topicUpdatesMonitor);

    if (topicUpdatesMonitor.length === 0) {
      this.logger.warn('no topic monitors received from MB');

      return [allOwners, []];
    }

    const existingTopicsMonitors: TopicMonitorEntity[] =
      await this.topicMonitorWrapper.topicRepository.get(allOwners);

    if (existingTopicsMonitors.length === 0) {
      this.logger.warn('no previously stored monitors');

      return [allOwners, topicUpdatesMonitor];
    }

    const ownersToReturn: string[] = [];
    const monitorsToReturn: TopicMonitorUpdates[] = [];

    for (const topicMonitor of topicUpdatesMonitor) {
      const matchingElement: TopicMonitorEntity | undefined =
        existingTopicsMonitors.find(
          (topicMonitorEntity: TopicMonitorEntity) =>
            topicMonitor.owner === topicMonitorEntity.owner
        );

      if (!matchingElement) {
        ownersToReturn.push(topicMonitor.owner);

        this.logger.log(
          `${topicMonitor.owner} monitor first time stored in database`
        );

        monitorsToReturn.push(topicMonitor);

        continue;
      }

      const hasTopicUpdated: boolean = moment(matchingElement.lastTopicUpdate)
        .utc()
        .isBefore(moment(topicMonitor.lastTopicUpdate).utc());

      const hasTopicVersionUpdated: boolean = moment(
        matchingElement.lastTopicVersionUpdate
      )
        .utc()
        .isBefore(moment(topicMonitor.lastTopicVersionUpdate).utc());

      this.logger.log(
        `${topicMonitor.owner} topic updated: ${hasTopicUpdated}, topic version updated: ${hasTopicVersionUpdated}`
      );

      if (hasTopicUpdated || hasTopicVersionUpdated) {
        ownersToReturn.push(topicMonitor.owner);

        this.logger.log(`${topicMonitor.owner} monitor updated`);

        monitorsToReturn.push(topicMonitor);
      }
    }

    return [ownersToReturn, monitorsToReturn];
  }

  protected async saveMonitor(mb: TopicMonitorUpdates): Promise<void> {
    await this.topicMonitorWrapper.topicRepository.save({
      owner: mb.owner,
      lastTopicUpdate: moment(mb.lastTopicUpdate).utc().toDate(),
      lastTopicVersionUpdate: moment(mb.lastTopicVersionUpdate).utc().toDate(),
    });
  }
}
