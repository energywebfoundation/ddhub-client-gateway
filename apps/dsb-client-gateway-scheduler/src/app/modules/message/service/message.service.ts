import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { SymmetricKeysCacheService } from '@dsb-client-gateway/ddhub-client-gateway-encryption';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  CronJobType,
  CronStatus,
  CronWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { CronJob } from 'cron';
import { ConfigService } from '@nestjs/config';
import { PendingAcksService } from './pending-acks.service';

@Injectable()
export class MessageService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(MessageService.name);

  constructor(
    protected readonly symmetricKeysService: SymmetricKeysCacheService,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly cronWrapper: CronWrapperRepository,
    protected readonly configService: ConfigService,
    protected readonly pendingAcksService: PendingAcksService
  ) {}

  async onApplicationBootstrap() {
    const isCronEnabled: boolean = this.configService.get<boolean>(
      'MESSAGE_CLEANER_CRON_ENABLED',
      true
    );

    if (!isCronEnabled) {
      this.logger.warn(`Message cron job is disabled`);

      return;
    }

    const cronJob = new CronJob(
      this.configService.get<string>('MESSAGE_CLEANER_CRON_SCHEDULE'),
      async () => {
        this.logger.log(`executing message cleaner`);

        await this.delete();
      }
    );

    await this.schedulerRegistry.addCronJob(
      CronJobType.MESSAGE_CLEANER,
      cronJob
    );

    cronJob.start();
  }

  public async delete(): Promise<void> {
    try {
      await this.symmetricKeysService.deleteExpiredKeys();

      await this.pendingAcksService.deleteOutdated();

      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.MESSAGE_CLEANER,
        latestStatus: CronStatus.SUCCESS,
        executedAt: new Date(),
      });
    } catch (e) {
      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.MESSAGE_CLEANER,
        latestStatus: CronStatus.FAILED,
        executedAt: new Date(),
      });

      this.logger.error('message clear failed', e);
    }
  }
}
