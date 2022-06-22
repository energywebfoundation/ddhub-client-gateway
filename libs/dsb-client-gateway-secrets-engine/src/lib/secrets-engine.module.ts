import { Module } from '@nestjs/common';
import { SecretsEngine } from './secrets-engine.const';
import { ConfigService } from '@nestjs/config';
import { AwsSecretsManagerService } from './service/aws-secrets-manager.service';
import { SecretsEngineService } from './secrets-engine.interface';
import { VaultService } from './service/vault.service';
import { InvalidEngineException } from './exceptions/invalid-engine.exception';
import { AzureKeyVaultService } from './service/azure-key-vault.service';

@Module({
  providers: [
    {
      provide: SecretsEngineService,
      useFactory: async (configService: ConfigService) => {
        const secretsEngine = configService.get('SECRETS_ENGINE');

        if (!secretsEngine) {
          throw new InvalidEngineException();
        }

        switch (secretsEngine) {
          case SecretsEngine.AWS:
            return new AwsSecretsManagerService(configService);
          case SecretsEngine.VAULT:
            return new VaultService(configService);
          case SecretsEngine.AZURE:
            return new AzureKeyVaultService(configService);
          default:
            throw new InvalidEngineException();
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: [SecretsEngineService],
})
export class SecretsEngineModule {}
