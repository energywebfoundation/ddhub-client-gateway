import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChannelDidCacheService } from '../service/channel-did-cache.service';
import { RefreshChannelCacheDataCommand } from '../command/refresh-channel-cache-data.command';

@CommandHandler(RefreshChannelCacheDataCommand)
export class RefreshChannelCacheDataHandler
  implements ICommandHandler<RefreshChannelCacheDataCommand>
{
  constructor(
    protected readonly channelDidCacheService: ChannelDidCacheService
  ) {}

  public async execute(command: RefreshChannelCacheDataCommand): Promise<void> {
    await this.channelDidCacheService.refreshChannelCache(command.fqcn);
  }
}
