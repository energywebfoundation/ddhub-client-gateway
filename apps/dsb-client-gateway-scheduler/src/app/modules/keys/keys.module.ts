import { Module } from '@nestjs/common';
import { DdhubClientGatewayEncryptionModule } from '@dsb-client-gateway/ddhub-client-gateway-encryption';
import { SymmetricKeysCronService } from './service/symmetric-keys-cron.service';
import {
  CronRepositoryModule,
  DidRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { KeysService } from './service/keys.service';
import { AssociationKeysCronService } from './service/association-keys-cron.service';
import { DdhubClientGatewayAssociationKeysModule } from '@dsb-client-gateway/ddhub-client-gateway-association-keys';

@Module({
  imports: [
    DdhubClientGatewayEncryptionModule,
    CronRepositoryModule,
    SecretsEngineModule,
    DidRepositoryModule,
    DdhubClientGatewayAssociationKeysModule,
  ],
  providers: [
    SymmetricKeysCronService,
    KeysService,
    AssociationKeysCronService,
  ],
  exports: [KeysService],
})
export class KeysModule {}
