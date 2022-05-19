import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CronJob } from 'cron';
import {
  CronJobType,
  CronStatus,
  CronWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { SchedulerRegistry } from '@nestjs/schedule';
import { SymmetricKeysCacheService } from '@dsb-client-gateway/ddhub-client-gateway-encryption';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SymmetricKeysCronService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SymmetricKeysCronService.name);

  constructor(
    protected readonly symmetricKeysCacheService: SymmetricKeysCacheService,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly cronWrapper: CronWrapperRepository,
    protected readonly configService: ConfigService
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const isCronEnabled: boolean = this.configService.get<boolean>(
      'SYMMETRIC_KEYS_CRON_ENABLED',
      true
    );

    if (!isCronEnabled) {
      this.logger.warn(`Symmetric keys cron job is disabled`);

      return;
    }

    const cronJob = new CronJob(
      this.configService.get<string>('SYMMETRIC_KEYS_CRON_SCHEDULE'),
      async () => {
        this.logger.log(`Executing symmetric keys service`);

        await this.refreshSymmetricKeysCache();
      }
    );

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
