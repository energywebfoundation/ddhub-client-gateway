import { Module } from '@nestjs/common';
import { KeysService } from './service/keys.service';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { KeysController } from './keys.controller';
import {
  DidRepositoryModule,
  DsbClientGatewayStorageModule,
  SymmetricKeysRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { RefreshKeysHandler } from './service/refresh-keys.handler';
import { StorageModule } from '../storage/storage.module';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { DdhubClientGatewayIdentityModule } from '@dsb-client-gateway/ddhub-client-gateway-identity';
import { DdhubClientGatewayEnrolmentModule } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';
import { DdhubClientGatewayEncryptionModule } from '@dsb-client-gateway/ddhub-client-gateway-encryption';
import { DdhubClientGatewayUtilsModule } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { DdhubClientGatewayAssociationKeysModule } from '@dsb-client-gateway/ddhub-client-gateway-association-keys';
import { CqrsModule } from '@nestjs/cqrs';
import { DdhubClientGatewayUserRolesModule } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

@Module({
  imports: [
    DdhubClientGatewayUserRolesModule,
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
    DdhubClientGatewayAssociationKeysModule,
    CqrsModule,
  ],
  providers: [KeysService, RefreshKeysHandler],
  controllers: [KeysController],
  exports: [KeysService],
})
export class KeysModule {}
