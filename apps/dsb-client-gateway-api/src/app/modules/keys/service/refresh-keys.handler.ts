import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { KeysService } from './keys.service';
import { RefreshKeysCommand } from '@dsb-client-gateway/ddhub-client-gateway-encryption';

@CommandHandler(RefreshKeysCommand)
export class RefreshKeysHandler implements ICommandHandler<RefreshKeysCommand> {
  constructor(protected readonly keysService: KeysService) {}

  public async execute(): Promise<void> {
    await this.keysService.generateKeys(true);
  }
}
