import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshInternalMessagesCacheCommand } from '../command/refresh-internal-messages-cache.command';
import { InternalMessageCacheService } from './internal-messsage-cache.service';

@CommandHandler(RefreshInternalMessagesCacheCommand)
export class RefreshInternalMessagesCacheHandler
  implements ICommandHandler<RefreshInternalMessagesCacheCommand>
{
  constructor(
    protected readonly internalMessageCacheService: InternalMessageCacheService
  ) {}

  public async execute(): Promise<void> {
    await this.internalMessageCacheService.refreshInternalMessageCache();
  }
}
