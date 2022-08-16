import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateEcdhKeyCommand } from '../command/generate-ecdh-key.command';
import { ECDHKdfService } from '../service';

@CommandHandler(GenerateEcdhKeyCommand)
export class GenerateEcdhKeyHandler
  implements ICommandHandler<GenerateEcdhKeyCommand>
{
  constructor(protected readonly ecdhKdfService: ECDHKdfService) {}

  public async execute(): Promise<any> {
    await this.ecdhKdfService.deriveKey();
  }
}
