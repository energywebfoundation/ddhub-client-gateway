import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class RefreshTopicsCacheCronService implements OnModuleInit {
  private readonly logger = new Logger(RefreshTopicsCacheCronService.name);

  constructor(
    protected readonly commandBus: CommandBus,
    protected readonly configService: ConfigService,
    protected readonly schedulerRegistry: SchedulerRegistry
  ) {}

  public async onModuleInit(): Promise<void> {
    const scheduledJobsEnabled: boolean = this.configService.get<boolean>(
      'SCHEDULED_JOBS',
      true
    );

    if (!scheduledJobsEnabled) {
      this.logger.log(`Cron jobs not enabled`);

      return;
    }

    this.logger.log(`Cron jobs enabled`);

    const job = new CronJob(`*/5 * * * *`, async () => {
      this.logger.log(`${jobName} CRON job triggered`);
    });

    const jobName = 'REFRESH_TOPICS_CACHE';

    this.schedulerRegistry.addCronJob(jobName, job);

    job.start();
  }
}
