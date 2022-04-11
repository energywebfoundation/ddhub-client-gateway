import { Injectable, Logger } from '@nestjs/common';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { ChannelService } from './channel.service';
import { DsbApiService } from '../../dsb-client/service/dsb-api.service';
import { IdentityService } from '../../identity/service/identity.service';
import { ChannelEntity } from '../entity/channel.entity';
import { TopicRepository } from '../repository/topic.repository';
import {
  Topic,
  TopicVersion,
  TopicVersionResponse,
} from '../../dsb-client/dsb-client.interface';

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
      'ANY',
      {
        retries: 1,
      }
    );

    this.logger.log(`Updating DIDs for ${internalChannel.fqcn}`);

    await this.channelService.updateChannelQualifiedDids(
      internalChannel.fqcn,
      rolesForDIDs
    );

    for (const { topicId, topicName, owner } of internalChannel.conditions
      .topics) {
      const topicInformation = await this.dsbApiService.getTopicsByOwnerAndName(
        topicName,
        owner
      );

      if (topicInformation.records.length === 0) {
        this.logger.warn(`Topic with id ${topicId} does not have any versions`);

        continue;
      }

      const topic: Topic = topicInformation.records[0];

      const topicVersion: TopicVersion | null =
        await this.dsbApiService.getTopicById(topic.id);

      if (!topicVersion) {
        this.logger.error(
          `Topic version is missing for topic with id ${topicId}`
        );
      }

      const topicVersions: TopicVersionResponse =
        await this.dsbApiService.getTopicVersions(topic.id);

      this.logger.log(`Found ${topicVersions.records.length} topic versions`);

      await this.channelService.updateChannelTopic(
        fqcn,
        topic.id,
        topicVersions.records.map((topicVersion) => ({
          id: topicVersion.id,
          owner: topic.owner,
          name: topic.name,
          schemaType: topic.schemaType,
          version: topicVersion.version,
          schema: topicVersion.schema,
        }))
      );

      this.logger.log('Found topic', topic);

      for (const { id, schema, version } of topicVersions.records) {
        await this.topicRepository.createOrUpdateTopic(
          {
            id,
            schema,
            version,
            owner: topic.owner,
            name: topic.name,
            schemaType: topic.schemaType,
          },
          id
        );
      }
    }
  }
}
