import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import {
  CronJobType,
  CronStatus,
  CronWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { MessageStoreService } from './message-store.service';

@Injectable()
export class MessagesCleanupService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(MessagesCleanupService.name);

  constructor(
    protected readonly configService: ConfigService,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly cronWrapper: CronWrapperRepository,
    protected readonly messageStoreService: MessageStoreService
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const isCronEnabled: boolean = this.configService.get<boolean>(
      'CLEANUP_MESSAGES_CRON_ENABLED',
      true
    );

    if (!isCronEnabled) {
      this.logger.warn(`Messages cleanup job is disabled`);

      return;
    }

    const cronJob = new CronJob(
      this.configService.get<string>('CLEANUP_MESSAGES_CRON_SCHEDULE'),
      async () => {
        this.logger.log(`Executing messages cleanup`);

        await this.execute();
      }
    );

    this.schedulerRegistry.addCronJob(
      CronJobType.OFFLINE_MESSAGES_CLEANER,
      cronJob
    );

    cronJob.start();
  }

  public async execute(): Promise<void> {
    try {
      await this.messageStoreService.deleteExpiredMessages();

      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.OFFLINE_MESSAGES_CLEANER,
        latestStatus: CronStatus.SUCCESS,
        executedAt: new Date(),
      });
    } catch (e) {
      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.OFFLINE_MESSAGES_CLEANER,
        latestStatus: CronStatus.FAILED,
        executedAt: new Date(),
      });

      this.logger.error('cleanup messages failed');
      this.logger.error(e);
    }
  }
}
