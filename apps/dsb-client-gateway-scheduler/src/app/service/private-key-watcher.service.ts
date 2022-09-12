import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Wallet } from 'ethers';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { EthersService } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { CronJob } from 'cron';
import {
  CronJobType,
  CronStatus,
  CronWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrivateKeyWatcherService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(PrivateKeyWatcherService.name);

  constructor(
    protected readonly secretsEngine: SecretsEngineService,
    protected readonly ethersService: EthersService,
    protected readonly iamService: IamService,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly cronWrapper: CronWrapperRepository,
    protected readonly configService: ConfigService
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const isCronEnabled: boolean = this.configService.get<boolean>(
      'PRIVATE_KEY_CRON_ENABLED',
      true
    );

    if (!isCronEnabled) {
      this.logger.warn(`Channel did cron job is disabled`);

      return;
    }

    const cronJob = new CronJob(
      this.configService.get<string>('PRIVATE_KEY_CRON_SCHEDULE'),
      async () => {
        this.logger.log(`Executing private key watcher`);

        await this.watch();
      }
    );

    this.schedulerRegistry.addCronJob(CronJobType.PRIVATE_KEY, cronJob);

    cronJob.start();
  }

  public async watch(): Promise<void> {
    try {
      const privateKey: string = await this.secretsEngine.getPrivateKey();

      const wallet: Wallet = this.ethersService.getWalletFromPrivateKey(
        privateKey
      );

      if (this.iamService.isInitialized()) {
        const didAddress: string | undefined = this.iamService
          .getDIDAddress()
          .split(':')
          .pop();

        if (!didAddress) {
          throw new Error('DID address malformed');
        }

        const walletAddress: string = await wallet.getAddress();

        if (didAddress === walletAddress) {
          this.logger.debug('private key has not changed');

          return;
        }

        this.logger.log('Private key has changed, re-initializing IAM');

        await this.iamService.setup(privateKey);

        return;
      }

      if (!privateKey) {
        this.logger.log('No private key supplied');

        return;
      }

      await this.iamService.setup(privateKey);

      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.PRIVATE_KEY,
        latestStatus: CronStatus.SUCCESS,
        executedAt: new Date(),
      });
    } catch (e) {
      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.PRIVATE_KEY,
        latestStatus: CronStatus.FAILED,
        executedAt: new Date(),
      });

      this.logger.error('watch private key failed', e);
    }
  }
}
