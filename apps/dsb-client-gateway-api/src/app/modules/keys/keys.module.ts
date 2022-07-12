import { Module } from '@nestjs/common';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { KeysController } from './keys.controller';
import {
  DidRepositoryModule,
  DsbClientGatewayStorageModule,
  SymmetricKeysRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { StorageModule } from '../storage/storage.module';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { DdhubClientGatewayIdentityModule } from '@dsb-client-gateway/ddhub-client-gateway-identity';
import { DdhubClientGatewayEnrolmentModule } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';
import { DdhubClientGatewayEncryptionModule } from '@dsb-client-gateway/ddhub-client-gateway-encryption';
import { DdhubClientGatewayUtilsModule } from '@dsb-client-gateway/ddhub-client-gateway-utils';

@Module({
  imports: [
    DsbClientGatewayStorageModule,
    SecretsEngineModule,
    SymmetricKeysRepositoryModule,
    DdhubClientGatewayIdentityModule,
    DdhubClientGatewayEnrolmentModule,
    StorageModule,
    DidRepositoryModule,
    DdhubClientGatewayUtilsModule,
    DdhubClientGatewayMessageBrokerModule,
    DdhubClientGatewayEncryptionModule,
  ],
  providers: [],
  controllers: [KeysController],
  exports: [],
})
export class KeysModule {}
