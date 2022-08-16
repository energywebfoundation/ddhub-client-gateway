import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { GenerateMasterSeedCommand } from '../command/generate-master-seed.command';
import { ECDHKdfService } from '../service/ecdh/ecdh-kdf.service';

@CommandHandler(GenerateMasterSeedCommand)
export class GenerateMasterSeedHandler
  implements ICommandHandler<GenerateMasterSeedCommand>
{
  constructor(
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly ecdhKdfService: ECDHKdfService
  ) {}

  public async execute({ address }: GenerateMasterSeedCommand): Promise<any> {
    await this.ecdhKdfService.createMasterSeedIfNotExists();
  }
}
