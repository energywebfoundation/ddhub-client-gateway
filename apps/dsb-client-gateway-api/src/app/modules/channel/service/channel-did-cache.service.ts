import { Injectable, Logger } from '@nestjs/common';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { ChannelService } from './channel.service';
import { Span } from 'nestjs-otel';
import {
  ChannelEntity,
  TopicRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import {
  DdhubDidService,
  DdhubTopicsService,
  TopicVersionResponse,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { IdentityService } from '@dsb-client-gateway/ddhub-client-gateway-identity';

@Injectable()
export class ChannelDidCacheService {
  private readonly logger = new Logger(ChannelDidCacheService.name);

  constructor(
    protected readonly iamService: IamService,
    protected readonly channelService: ChannelService,
    protected readonly identityService: IdentityService,
    protected readonly ddhubTopicService: DdhubTopicsService,
    protected readonly ddhubDidService: DdhubDidService,
    protected readonly wrapper: TopicRepositoryWrapper
  ) {}

  @Span('channel_refreshChannelCache')
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
      await this.channelService.getChannelOrThrow(fqcn);

    const rolesForDIDs: string[] = await this.ddhubDidService.getDIDsFromRoles(
      internalChannel.conditions.roles,
      'ANY',
      {
        retries: 1,
      }
    );

    this.logger.log(`Updating DIDs for ${internalChannel.fqcn}`);

    const uniqueDids: string[] = [
      ...new Set([...rolesForDIDs, ...(internalChannel.conditions.dids ?? [])]),
    ];

    await this.channelService.updateChannelQualifiedDids(
      internalChannel.fqcn,
      uniqueDids
    );

    for (const { topicId, owner, topicName } of internalChannel.conditions
      .topics) {
      const topicVersions: TopicVersionResponse =
        await this.ddhubTopicService.getTopicVersions(topicId);

      for (const topicVersion of topicVersions.records) {
        const [major, minor, patch]: string[] = topicVersion.version.split('.');

        await this.wrapper.topicRepository.save({
          id: topicId,
          owner: owner,
          name: topicName,
          schemaType: topicVersion.schemaType,
          version: topicVersion.version,
          schema: topicVersion.schema,
          tags: topicVersion.tags,
          majorVersion: major,
          minorVersion: minor,
          patchVersion: patch,
        });

        this.logger.log(
          `stored topic with name ${topicVersion.name} and owner ${topicVersion.owner} with version ${topicVersion.version}`
        );
      }
    }
  }
}
