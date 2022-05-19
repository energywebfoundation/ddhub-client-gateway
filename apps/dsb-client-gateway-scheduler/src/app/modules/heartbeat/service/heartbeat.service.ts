import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { CronJobType } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HeartbeatService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(HeartbeatService.name);

  constructor(
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly configService: ConfigService
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const isCronEnabled: boolean = this.configService.get<boolean>(
      'HEARTBEAT_ENABLED',
      true
    );

    if (!isCronEnabled) {
      this.logger.warn(`Heartbeat cron job is disabled`);

      return;
    }

    const cronJob = new CronJob(
      this.configService.get<string>('HEARTBEAT_CRON_SCHEDULE'),
      async () => {
        await this.handleCron();
      }
    );

    await this.schedulerRegistry.addCronJob(CronJobType.HEARTBEAT, cronJob);

    cronJob.start();
  }

  public handleCron(): void {
    const cronJobs: Map<string, CronJob> = this.schedulerRegistry.getCronJobs();

    cronJobs.forEach((value, key) => {
      let next;
      try {
        next = value.nextDates().toDate();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      this.logger.log(`job: ${key} -> next: ${next}`);
    });
  }
}
