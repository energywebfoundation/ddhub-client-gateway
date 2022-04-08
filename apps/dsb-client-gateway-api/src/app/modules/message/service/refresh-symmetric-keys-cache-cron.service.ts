import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { RefreshSymmetricKeysCacheCommand } from '../command/refresh-symmetric-keys-cache.command';

@Injectable()
export class RefreshSymmetricKeysCacheCronService
  implements OnApplicationBootstrap
{
  private readonly logger = new Logger(
    RefreshSymmetricKeysCacheCronService.name
  );

  constructor(
    protected readonly commandBus: CommandBus,
    protected readonly configService: ConfigService,
    protected readonly schedulerRegistry: SchedulerRegistry
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const scheduledJobsEnabled: boolean = this.configService.get<boolean>(
      'SCHEDULED_JOBS',
      true
    );

    if (!scheduledJobsEnabled) {
      this.logger.log(`Cron jobs not enabled`);

      return;
    }

    this.logger.log(`Cron jobs enabled`);

    const job = new CronJob(
      this.configService.get('REFRESH_SYMMETRIC_KEY_CRON_TIME'),
      async () => {
        this.logger.log(`${jobName} CRON job triggered`);
        await this.commandBus.execute(new RefreshSymmetricKeysCacheCommand());
      }
    );

    const jobName = 'REFRESH_INTERNAL_MESSAGES_CACHE';

    this.schedulerRegistry.addCronJob(jobName, job);

    job.start();
  }
}
