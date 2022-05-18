import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class HeartbeatService {
  protected readonly logger = new Logger(HeartbeatService.name);

  constructor(protected readonly schedulerRegistry: SchedulerRegistry) {}

  @Cron('30 * * * * *', {
    name: 'HEARTBEAT',
  })
  public handleCron(): void {
    const cronJobs: Map<string, CronJob> = this.schedulerRegistry.getCronJobs();

    cronJobs.forEach((value, key, map) => {
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
