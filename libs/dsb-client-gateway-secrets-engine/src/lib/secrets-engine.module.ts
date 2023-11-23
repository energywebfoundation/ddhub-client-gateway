import { Module } from '@nestjs/common';
import { SecretsEngine } from './secrets-engine.const';
import { ConfigService } from '@nestjs/config';
import { AwsSecretsManagerService } from './service/service/aws-secrets-manager.service';
import { SecretsEngineService } from './secrets-engine.interface';
import { VaultService } from './service/service/vault.service';
import { InvalidEngineException } from './exceptions/invalid-engine.exception';
import { SecretsCacheProxyService } from './service';
import { SecretChangeHandler } from './service/command/secret-change.handler';
import { AzureKeyVaultService } from './service/service/azure-key-vault.service';

@Module({
  providers: [
    SecretChangeHandler,
    {
      provide: SecretsEngineService,
      useFactory: async (configService: ConfigService) => {
        const useCache: boolean = configService.get<boolean>('USE_CACHE');
        const secretsEngine: SecretsEngine =
          configService.get('SECRETS_ENGINE');

        if (!secretsEngine) {
          throw new InvalidEngineException();
        }

        let engineToUse: SecretsEngineService;

        switch (secretsEngine) {
          case SecretsEngine.AWS:
            engineToUse = new AwsSecretsManagerService(configService);
            break;
          case SecretsEngine.VAULT:
            engineToUse = new VaultService(configService);
            break;
          case SecretsEngine.AZURE:
            engineToUse = new AzureKeyVaultService(configService);
            break;
          default:
            throw new InvalidEngineException();
        }

        if (useCache) {
          await engineToUse.onModuleInit();

          const proxy = new SecretsCacheProxyService(engineToUse);

          await proxy.init();

          return proxy;
        }

        return engineToUse;
      },
      inject: [ConfigService],
    },
  ],
  exports: [SecretsEngineService],
})
export class SecretsEngineModule {}
