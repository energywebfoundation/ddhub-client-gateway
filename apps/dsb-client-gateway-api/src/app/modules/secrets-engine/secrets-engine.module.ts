import { Module } from '@nestjs/common';
import { SecretsEngine } from './secrets-engine.const';
import { ConfigService } from '@nestjs/config';
import { AwsSsmService } from './service/aws-ssm.service';
import { SecretsEngineService } from './secrets-engine.interface';
import { VaultService } from './service/vault.service';
import { IamInitService } from './service/iam-init.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  providers: [
    {
      provide: SecretsEngineService,
      useFactory: (configService: ConfigService) => {
        const secretsEngine = configService.get('SECRETS_ENGINE');

        if (!secretsEngine) {
          throw new Error('You need to specify secrets engine');
        }

        switch (secretsEngine) {
          case SecretsEngine.AWS:
            return new AwsSsmService(configService);
          case SecretsEngine.VAULT:
            return new VaultService(configService);
          default:
            throw new Error('Unspecified secrets engine');
        }
      },
      inject: [ConfigService],
    },
    IamInitService,
  ],
  exports: [SecretsEngineService],
})
export class SecretsEngineModule {}
