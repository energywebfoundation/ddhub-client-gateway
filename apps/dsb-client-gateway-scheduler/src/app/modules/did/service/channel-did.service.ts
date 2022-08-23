import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import {
  ChannelEntity,
  ChannelWrapperRepository,
  CronJobType,
  CronStatus,
  CronWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { DdhubDidService } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Span } from 'nestjs-otel';
import { ConfigService } from '@nestjs/config';
import { KeysService } from '../../keys/service/keys.service';

@Injectable()
export class ChannelDidService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(ChannelDidService.name);

  constructor(
    protected readonly wrapper: ChannelWrapperRepository,
    protected readonly iamService: IamService,
    protected readonly keyService: KeysService,
    protected readonly ddhubDidService: DdhubDidService,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly cronWrapper: CronWrapperRepository,
    protected readonly configService: ConfigService
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const isCronEnabled: boolean = this.configService.get<boolean>(
      'CHANNEL_DID_CRON_ENABLED',
      true
    );

    if (!isCronEnabled) {
      this.logger.warn(`Channel did cron job is disabled`);

      return;
    }

    const cronJob = new CronJob(
      this.configService.get<string>('CHANNEL_DID_CRON_SCHEDULE'),
      async () => {
        this.logger.log(`Executing channel DID refresh`);

        await this.refreshChannelDids();
      }
    );

    await this.schedulerRegistry.addCronJob(CronJobType.CHANNEL_ROLES, cronJob);

    cronJob.start();
  }

  @Span('channel_dids_refresh')
  public async refreshChannelDids(): Promise<void> {
    const channels: ChannelEntity[] =
      await this.wrapper.channelRepository.find();

    this.logger.log(`found ${channels.length} channels`);

    try {
      let allUniqueChannelDids: string[] = [];
      for (const channel of channels) {
        this.logger.log(`Updating DIDs for ${channel.fqcn}`);

        let channelRoleUniqueDids: string[] = [];
        if (channel.conditions.roles && channel.conditions.roles.length > 0) {
          channelRoleUniqueDids = await this.ddhubDidService.getDIDsFromRoles(
            channel.conditions.roles,
            'ANY',
            {
              retries: 1,
            }
          );
        }

        let channelUniqueDids: string[] = [];
        if (channel.conditions.dids && channel.conditions.dids.length > 0) {
          channelUniqueDids = channel.conditions.dids;
        }

        const uniqueDidsForChannel: string[] = [
          ...new Set([...channelRoleUniqueDids, ...channelUniqueDids]),
        ];
        allUniqueChannelDids = [...new Set([...allUniqueChannelDids, ...uniqueDidsForChannel])];

        this.logger.log(
          `found ${uniqueDidsForChannel.length} DIDS for channel ${channel.fqcn}`,
          uniqueDidsForChannel
        );

        channel.conditions.qualifiedDids = uniqueDidsForChannel;

        await this.wrapper.channelRepository.save(channel);
      }

      this.logger.debug(`Updating DID cache for qualifiedDids`, allUniqueChannelDids);
      const updatedDids = await Promise.allSettled(allUniqueChannelDids.map(async (did) => this.keyService.getDid(did)))
      this.logger.debug(`Updated did cache`, JSON.stringify(updatedDids));

      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.CHANNEL_ROLES,
        latestStatus: CronStatus.SUCCESS,
        executedAt: new Date(),
      });
    } catch (e) {
      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.CHANNEL_ROLES,
        latestStatus: CronStatus.FAILED,
        executedAt: new Date(),
      });

      this.logger.error('refresh dids failed', e);
    }
  }
}
