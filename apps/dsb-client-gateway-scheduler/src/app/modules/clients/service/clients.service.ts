import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ClientsService as ClientsLibService } from '@dsb-client-gateway/ddhub-client-gateway-clients';
import { CronJob } from 'cron';
import {
  ClientEntity,
  CronJobType,
  CronStatus,
  CronWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import moment from 'moment';

@Injectable()
export class ClientsService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(ClientsService.name);

  constructor(
    protected readonly clientsLibService: ClientsLibService,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly cronWrapper: CronWrapperRepository,
    protected readonly configService: ConfigService
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const isCronEnabled: boolean = this.configService.get<boolean>(
      'CLIENTS_CRON_ENABLED',
      true
    );

    if (!isCronEnabled) {
      this.logger.warn(`Clients cron job is disabled`);

      return;
    }

    const cronJob = new CronJob(
      this.configService.get<string>('CLIENTS_CRON_SCHEDULE'),
      async () => {
        this.logger.log(`Executing clients clear`);

        await this.execute();
      }
    );

    await this.schedulerRegistry.addCronJob(CronJobType.CLIENTS, cronJob);

    cronJob.start();
  }

  public async execute(): Promise<void> {
    try {
      await this.clientsLibService.syncMissingClientsIds();

      const till: Date = moment()
        .subtract(
          this.configService.get<number>('CLIENT_EXPIRATION_DAYS'),
          'days'
        )
        .toDate();

      const outdatedClients: ClientEntity[] =
        await this.clientsLibService.getOutdatedClients(till);

      for (const client of outdatedClients) {
        this.logger.log(`deleting client ${client.clientId}`);

        await this.clientsLibService.delete(client.clientId);
      }

      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.CLIENTS,
        latestStatus: CronStatus.SUCCESS,
        executedAt: new Date(),
      });
    } catch (e) {
      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.CLIENTS,
        latestStatus: CronStatus.FAILED,
        executedAt: new Date(),
      });

      this.logger.error('clients failed', e);
    }
  }
}
