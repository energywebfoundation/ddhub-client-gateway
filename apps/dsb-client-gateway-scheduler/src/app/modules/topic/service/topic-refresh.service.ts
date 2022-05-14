import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { TopicRepositoryWrapper } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import {
  DdhubTopicsService,
  TopicDataResponse,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TopicRefreshService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(TopicRefreshService.name);

  constructor(
    protected readonly wrapper: TopicRepositoryWrapper,
    protected readonly iamService: IamService,
    protected readonly ddhubTopicsService: DdhubTopicsService,
    protected readonly schedulerRegistry: SchedulerRegistry
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const cronJob = new CronJob(`*/1 * * * *`, async () => {
      this.logger.log(`Executing topic refresh `);

      await this.refreshTopics();
    });

    await this.schedulerRegistry.addCronJob('refresh_topics', cronJob);

    cronJob.start();
  }

  public async refreshTopics(): Promise<void> {
    const isInitialized: boolean = this.iamService.isInitialized();

    if (!isInitialized) {
      this.logger.error(`IAM is not initialized. Please setup private key`);

      return;
    }

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

      console.log(topicsForApplication);
    }
  }
}
