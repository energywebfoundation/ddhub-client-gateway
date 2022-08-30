import { Module } from '@nestjs/common';
import { DdhubClientGatewayEncryptionModule } from '@dsb-client-gateway/ddhub-client-gateway-encryption';
import { SymmetricKeysCronService } from './service/symmetric-keys-cron.service';
import {
  CronRepositoryModule,
  DidRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { KeysService } from './service/keys.service';

@Module({
  imports: [
    DdhubClientGatewayEncryptionModule,
    CronRepositoryModule,
    SecretsEngineModule,
    DidRepositoryModule,
  ],
  providers: [SymmetricKeysCronService, KeysService],
  exports: [KeysService],
})
export class KeysModule {}
