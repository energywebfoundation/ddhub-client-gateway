import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshSymmetricKeysCacheCommand } from '../command/refresh-symmetric-keys-cache.command';
import { SymmetricKeysCacheService } from './symmetric-keys-cache.service';

@CommandHandler(RefreshSymmetricKeysCacheCommand)
export class RefreshSymmetricKeysCacheHandler
  implements ICommandHandler<RefreshSymmetricKeysCacheCommand>
{
  constructor(
    protected readonly symmetricKeysCacheService: SymmetricKeysCacheService
  ) {}

  public async execute(): Promise<void> {
    await this.symmetricKeysCacheService.refreshSymmetricKeysCache();
  }
}
