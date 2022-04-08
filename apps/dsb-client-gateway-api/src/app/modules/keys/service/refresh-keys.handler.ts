import { RefreshKeysCommand } from '../command/refresh-keys.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { KeysService } from './keys.service';

@CommandHandler(RefreshKeysCommand)
export class RefreshKeysHandler implements ICommandHandler<RefreshKeysCommand> {
  constructor(protected readonly keysService: KeysService) {}

  public async execute(): Promise<void> {
    await this.keysService.onModuleInit();
  }
}
