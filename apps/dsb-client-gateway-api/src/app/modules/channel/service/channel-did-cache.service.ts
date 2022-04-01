import { Injectable, Logger } from '@nestjs/common';
import { IamService } from '../../iam-service/service/iam.service';
import { ChannelService } from './channel.service';
import { DsbApiService } from '../../dsb-client/service/dsb-api.service';
import { IdentityService } from '../../identity/service/identity.service';
import { ChannelEntity } from '../entity/channel.entity';
import { TopicVersionResponse } from '../../dsb-client/dsb-client.interface';
import { TopicRepository } from '../repository/topic.repository';

@Injectable()
export class ChannelDidCacheService {
  private readonly logger = new Logger(ChannelDidCacheService.name);

  constructor(
    protected readonly iamService: IamService,
    protected readonly channelService: ChannelService,
    protected readonly dsbApiService: DsbApiService,
    protected readonly identityService: IdentityService,
    protected readonly topicRepository: TopicRepository
  ) {}

  public async refreshChannelCache(fqcn: string): Promise<void> {
    if (!this.iamService.isInitialized()) {
      this.logger.warn('IAM connection is not initialized, skipping');

      return;
    }

    const identityReady: boolean = await this.identityService.identityReady();

    if (!identityReady) {
      this.logger.warn('Private key not set');

      return;
    }

    const internalChannel: ChannelEntity =
      this.channelService.getChannelOrThrow(fqcn);

    const rolesForDIDs: string[] = await this.dsbApiService.getDIDsFromRoles(
      internalChannel.conditions.roles,
      'ANY'
    );

    if (!rolesForDIDs.length) {
      this.logger.warn(
        `There is no single DID for listed roles`,
        internalChannel.conditions.roles
      );
    } else {
      this.logger.log(`Updating DIDs for ${internalChannel.fqcn}`);

      await this.channelService.updateChannelQualifiedDids(
        internalChannel.fqcn,
        rolesForDIDs
      );
    }

    for (const { topicId } of internalChannel.conditions.topics) {
      const topicVersions: TopicVersionResponse =
        await this.dsbApiService.getTopicVersions(topicId);

      if (topicVersions.records.length === 0) {
        this.logger.warn(`Topic with id ${topicId} does not have any versions`);

        continue;
      }

      await this.channelService.updateChannelTopic(
        internalChannel.fqcn,
        topicId,
        topicVersions.records
      );

      for (const topicVersion of topicVersions.records) {
        await this.topicRepository.createOrUpdateTopic(topicVersion, topicId);
      }
    }
  }
}
