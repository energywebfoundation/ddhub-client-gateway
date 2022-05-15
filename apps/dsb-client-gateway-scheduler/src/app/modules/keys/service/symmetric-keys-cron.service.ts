import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CronJob } from 'cron';
import {
  CronJobType,
  CronStatus,
  CronWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { SchedulerRegistry } from '@nestjs/schedule';
import { SymmetricKeysCacheService } from '@dsb-client-gateway/ddhub-client-gateway-encryption';

@Injectable()
export class SymmetricKeysCronService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SymmetricKeysCronService.name);

  constructor(
    protected readonly symmetricKeysCacheService: SymmetricKeysCacheService,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly cronWrapper: CronWrapperRepository
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const cronJob = new CronJob(`*/1 * * * *`, async () => {
      this.logger.log(`Executing symmetric keys service`);

      await this.refreshSymmetricKeysCache();
    });

    await this.schedulerRegistry.addCronJob(
      CronJobType.SYMMETRIC_KEYS,
      cronJob
    );

    cronJob.start();
  }

  public async refreshSymmetricKeysCache(): Promise<void> {
    try {
      this.logger.log('attempting to fetch symmetric keys');

      await this.symmetricKeysCacheService.refreshSymmetricKeysCache();

      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.SYMMETRIC_KEYS,
        latestStatus: CronStatus.SUCCESS,
        executedAt: new Date(),
      });
    } catch (e) {
      this.logger.error('Failed when fetching symmetric keys', e);

      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.SYMMETRIC_KEYS,
        latestStatus: CronStatus.FAILED,
        executedAt: new Date(),
      });
    }
  }
}
