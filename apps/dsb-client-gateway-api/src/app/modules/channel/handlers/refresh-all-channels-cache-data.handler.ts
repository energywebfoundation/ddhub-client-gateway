import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshAllChannelsCacheDataCommand } from '../command/refresh-all-channels-cache-data.command';
import { ChannelDidCacheService } from '../service/channel-did-cache.service';
import { ChannelService } from '../service/channel.service';
import { Logger } from '@nestjs/common';
import { ChannelEntity } from '@dsb-client-gateway/dsb-client-gateway-storage';

@CommandHandler(RefreshAllChannelsCacheDataCommand)
export class RefreshAllChannelsCacheDataHandler
  implements ICommandHandler<RefreshAllChannelsCacheDataCommand>
{
  private readonly logger = new Logger(RefreshAllChannelsCacheDataHandler.name);

  constructor(
    protected readonly channelDidCacheService: ChannelDidCacheService,
    protected readonly channelService: ChannelService
  ) {}

  public async execute(): Promise<void> {
    const internalChannels: ChannelEntity[] =
      await this.channelService.getChannels();

    if (internalChannels.length === 0) {
      this.logger.log('No internal channels, job not running');

      return;
    }

    for (const channel of internalChannels) {
      try {
        await this.channelDidCacheService.refreshChannelCache(channel.fqcn);
      } catch (e) {
        this.logger.error('Refreshing cache failed', channel.fqcn, e);
      }
    }
  }
}
