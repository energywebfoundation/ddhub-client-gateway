import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import {
  ApplicationWrapperRepository,
  CronJobType,
  CronStatus,
  CronWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { CronJob } from 'cron';
import { Span } from 'nestjs-otel';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  DdhubTopicsService,
  Topic,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApplicationService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(ApplicationService.name);

  constructor(
    protected readonly iamService: IamService,
    protected readonly cronWrapper: CronWrapperRepository,
    protected readonly applicationWrapper: ApplicationWrapperRepository,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly ddhubTopicService: DdhubTopicsService,
    protected readonly configService: ConfigService
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

        await this.refreshApplications('user');
        await this.refreshApplications('topiccreator');
      }
    );

    await this.schedulerRegistry.addCronJob(
      CronJobType.APPLICATIONS_REFRESH,
      cronJob
    );

    cronJob.start();
  }

  @Span('applications_refresh')
  protected async refreshApplications(
    roleName: 'user' | 'topiccreator'
  ): Promise<void> {
    try {
      const isInitialized: boolean = this.iamService.isInitialized();

      if (!isInitialized) {
        this.logger.error(`IAM is not initialized. Please setup private key`);

        return;
      }

      this.logger.log('fetching all available applications for ' + roleName);

      const applications = await this.iamService.getApplicationsByOwnerAndRole(
        roleName,
        this.iamService.getDIDAddress()
      );

      const namespaces = applications
        .map(({ namespace }) => namespace)
        .filter(Boolean);

      const topicsCount: Topic[] =
        await this.ddhubTopicService.getTopicsCountByOwner(namespaces);

      for (const application of applications) {
        await this.applicationWrapper.repository.save({
          appName: application.appName,
          description: application.description,
          logoUrl: application.logoUrl,
          websiteUrl: application.websiteUrl,
          namespace: application.namespace,
          topicsCount: topicsCount[application.namespace] || 0,
        });

        this.logger.log(
          `stored application ${application.appName} with namespace ${application.namespace}`
        );
      }

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
}
