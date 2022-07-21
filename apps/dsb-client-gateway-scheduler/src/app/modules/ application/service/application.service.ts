import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import {
  ApplicationWrapperRepository,
  CronJobType,
  CronStatus,
  CronWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import {
  ApplicationDTO,
  IamService,
  InitIamCommand,
} from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { CronJob } from 'cron';
import { Span } from 'nestjs-otel';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  DdhubTopicsService,
  TopicCountDto,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class ApplicationService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(ApplicationService.name);

  constructor(
    protected readonly iamService: IamService,
    protected readonly cronWrapper: CronWrapperRepository,
    protected readonly applicationWrapper: ApplicationWrapperRepository,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly ddhubTopicService: DdhubTopicsService,
    protected readonly configService: ConfigService,
    protected readonly commandBus: CommandBus
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const isCronEnabled: boolean = this.configService.get<boolean>(
      'APPLICATION_CRON_ENABLED',
      true
    );

    if (!isCronEnabled) {
      this.logger.warn(`Application cron job is disabled`);

      return;
    }

    const cronJob = new CronJob(
      this.configService.get<string>('APPLICATION_CRON_SCHEDULE'),
      async () => {
        this.logger.log(`Executing applications refresh`);

        await this.refreshApplications();
      }
    );

    await this.schedulerRegistry.addCronJob(
      CronJobType.APPLICATIONS_REFRESH,
      cronJob
    );

    cronJob.start();
  }

  @Span('applications_refresh')
  protected async refreshApplications(): Promise<void> {
    try {
      const isInitialized: boolean = this.iamService.isInitialized();

      if (!isInitialized) {
        this.logger.error(`IAM is not initialized. Attempting to init IAM`);

        await this.commandBus.execute(new InitIamCommand());

        return;
      }

      const userApplications = await this.iamService
        .getApplicationsByOwnerAndRole('user', this.iamService.getDIDAddress())
        .catch((e) => {
          this.logger.error(
            'fetching applications for role user ' +
              this.iamService.getDIDAddress() +
              ' failed'
          );
          this.logger.error(e);

          throw e;
        });

      this.logger.log('userApplications', userApplications);

      const topicCreatorApplications = await this.iamService
        .getApplicationsByOwnerAndRole(
          'topiccreator',
          this.iamService.getDIDAddress()
        )
        .catch((e) => {
          this.logger.error(
            'fetching applications for role topiccreator ' +
              this.iamService.getDIDAddress() +
              ' failed'
          );
          this.logger.error(e);

          throw e;
        });

      const userApplicationRoles = this.getRoles(userApplications, 'user');
      const allApplicationsRoles = this.getRoles(
        topicCreatorApplications,
        'topiccreator',
        userApplicationRoles
      );

      const combinedApplications: ApplicationDTO[] = [
        ...userApplications,
        ...topicCreatorApplications,
      ];

      this.logger.log('combined applications');
      this.logger.log(combinedApplications);

      const namespaces: string[] = combinedApplications
        .map(({ namespace }) => namespace)
        .filter(Boolean);

      const topicsCount: TopicCountDto[] =
        await this.ddhubTopicService.getTopicsCountByOwner(namespaces);

      this.logger.log('START: List of combined apps');
      this.logger.log('topicsCount: ' + JSON.stringify(topicsCount));
      this.logger.log(
        'allApplicationsRoles: ' + JSON.stringify(allApplicationsRoles)
      );
      for (const application of combinedApplications) {
        this.logger.log(JSON.stringify(application));

        const countOfTopics = topicsCount.find(
          (topic) => topic.owner === application.namespace
        );

        await this.applicationWrapper.repository.save({
          appName: application.appName,
          description: application.description,
          logoUrl: application.logoUrl,
          websiteUrl: application.websiteUrl,
          namespace: application.namespace,
          topicsCount: countOfTopics ? countOfTopics.count : 0,
          roles: allApplicationsRoles[this.getKey(application)] || [],
        });

        this.logger.log(
          `stored application ${application.appName} with namespace ${application.namespace}`
        );
      }
      this.logger.log('END: List of combined apps');

      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.APPLICATIONS_REFRESH,
        latestStatus: CronStatus.SUCCESS,
        executedAt: new Date(),
      });
    } catch (e) {
      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.APPLICATIONS_REFRESH,
        latestStatus: CronStatus.FAILED,
        executedAt: new Date(),
      });

      this.logger.error('refresh applications failed', e);
    }
  }

  protected getRoles(
    applications: ApplicationDTO[],
    role: string,
    initialApplicationRoles: Record<string, string[]> = {}
  ): Record<string, string[]> {
    const applicationRoles: Record<string, string[]> = initialApplicationRoles;

    applications.forEach((application) => {
      const key = this.getKey(application);

      if (!applicationRoles[key]) {
        applicationRoles[key] = [role];

        return;
      }

      if (applicationRoles[key].includes(role)) {
        return;
      }

      applicationRoles[key].push(role);
    });

    return applicationRoles;
  }

  protected getKey(application: ApplicationDTO): string {
    return `${application.appName}_${application.namespace}`;
  }
}
