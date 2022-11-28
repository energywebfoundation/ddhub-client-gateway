import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CronJob } from 'cron';
import {
  CronJobType,
  CronStatus,
  CronWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { AssociationKeysService } from '@dsb-client-gateway/ddhub-client-gateway-association-keys';

@Injectable()
export class AssociationKeysCronService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AssociationKeysCronService.name);

  constructor(
    protected readonly associationKeysService: AssociationKeysService,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly cronWrapper: CronWrapperRepository,
    protected readonly configService: ConfigService
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const isCronEnabled: boolean = this.configService.get<boolean>(
      'ASSOCIATION_KEYS_CRON_ENABLED',
      true
    );

    if (!isCronEnabled) {
      this.logger.warn(`Association keys cron job is disabled`);

      return;
    }

    const cronJob = new CronJob(
      this.configService.get<string>('ASSOCIATION_KEYS_CRON_SCHEDULE'),
      async () => {
        this.logger.log(`Executing association keys service`);

        await this.generateAssociationKeys();
      }
    );

    await this.schedulerRegistry.addCronJob(
      CronJobType.ASSOCIATION_KEYS,
      cronJob
    );

    cronJob.start();
  }

  public async generateAssociationKeys(): Promise<void> {
    try {
      this.logger.log('attempting to fetch association keys');

      await this.associationKeysService.derivePublicKeys();

      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.ASSOCIATION_KEYS,
        latestStatus: CronStatus.SUCCESS,
        executedAt: new Date(),
      });
    } catch (e) {
      this.logger.error('Failed when generating association keys', e);

      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.ASSOCIATION_KEYS,
        latestStatus: CronStatus.FAILED,
        executedAt: new Date(),
      });
    }
  }
}
