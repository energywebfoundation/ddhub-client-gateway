import { Injectable, Logger } from '@nestjs/common';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { ChannelService } from './channel.service';
import { Span } from 'nestjs-otel';
import { ChannelEntity } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { TopicService } from './topic.service';
import { DdhubDidService } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { IdentityService } from '@dsb-client-gateway/ddhub-client-gateway-identity';

@Injectable()
export class ChannelDidCacheService {
  private readonly logger = new Logger(ChannelDidCacheService.name);

  constructor(
    protected readonly iamService: IamService,
    protected readonly channelService: ChannelService,
    protected readonly identityService: IdentityService,
    protected readonly topicService: TopicService,
    protected readonly ddhubDidService: DdhubDidService
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
  }
}
