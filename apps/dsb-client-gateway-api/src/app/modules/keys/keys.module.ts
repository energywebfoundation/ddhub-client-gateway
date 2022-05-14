import { Module } from '@nestjs/common';
import { KeysService } from './service/keys.service';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { KeysController } from './keys.controller';
import {
  DidRepositoryModule,
  DsbClientGatewayStorageModule,
  SymmetricKeysRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { SymmetricKeysCacheService } from '../message/service/symmetric-keys-cache.service';
import { RefreshKeysHandler } from './service/refresh-keys.handler';
import { StorageModule } from '../storage/storage.module';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { DdhubClientGatewayIdentityModule } from '@dsb-client-gateway/ddhub-client-gateway-identity';
import { DdhubClientGatewayEnrolmentModule } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';

@Module({
  imports: [
    DsbClientGatewayStorageModule,
    SecretsEngineModule,
    SymmetricKeysRepositoryModule,
    DdhubClientGatewayIdentityModule,
    DdhubClientGatewayEnrolmentModule,
    StorageModule,
    DidRepositoryModule,
    DdhubClientGatewayMessageBrokerModule.forRootAsync([
      DdhubClientGatewayEnrolmentModule,
    ]),
  ],
  providers: [KeysService, SymmetricKeysCacheService, RefreshKeysHandler],
  controllers: [KeysController],
  exports: [KeysService, SymmetricKeysCacheService],
})
export class KeysModule {}
