import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTopicsCacheCommand } from '../command/refresh-topics-cache.command';
import { ChannelDidCacheService } from './channel-did-cache.service';

@CommandHandler(RefreshTopicsCacheCommand)
export class RefreshTopicsCacheHandler
  implements ICommandHandler<RefreshTopicsCacheCommand>
{
  constructor(
    protected readonly channelDidCacheService: ChannelDidCacheService
  ) {}

  public async execute(): Promise<void> {
    await this.channelDidCacheService.refreshChannelCache();
  }
}
