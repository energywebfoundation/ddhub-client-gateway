import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecretChangeCommand } from './secret-change.command';
import { SecretsCacheProxyService } from '../proxy';
import { SecretsEngineService } from '../../secrets-engine.interface';
import { SecretType } from '../../secrets-engine.const';
import { Logger } from '@nestjs/common';

@CommandHandler(SecretChangeCommand)
export class SecretChangeHandler
  implements ICommandHandler<SecretChangeCommand>
{
  protected readonly logger = new Logger(SecretChangeHandler.name);

  constructor(protected readonly secretsEngineService: SecretsEngineService) {}

  public async execute({ secretType }: SecretChangeCommand): Promise<void> {
    if (!(this.secretsEngineService instanceof SecretsCacheProxyService)) {
      return;
    }

    switch (secretType) {
      case SecretType.CERTIFICATE:
        await this.secretsEngineService.refreshCertificate();
        break;
      case SecretType.PRIVATE_KEY:
        await this.secretsEngineService.refreshPrivateKey();
        break;
      case SecretType.RSA:
        await this.secretsEngineService.refreshRsaPrivateKey();
        break;
      default:
        this.logger.error(`unknown operation ${secretType}`);
    }
  }
}
