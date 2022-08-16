import { forwardRef, Module } from '@nestjs/common';
import {
  EcdhEncryptionService,
  ECDHKdfService,
  EcdhTagService,
  RsaEncryptionService,
  RsaKdfService,
  RsaKeyService,
  SymmetricKeysCacheService,
} from './service';
import { DdhubClientGatewayEnrolmentModule } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';
import { DdhubClientGatewayIdentityModule } from '@dsb-client-gateway/ddhub-client-gateway-identity';
import {
  DidRepositoryModule,
  IterationRepositoryModule,
  KeyRepositoryModule,
  SymmetricKeysRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { DdhubClientGatewayUtilsModule } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { GenerateMasterSeedHandler } from './handler/generate-master-seed.handler';
import { EcdhKeyService } from './service/ecdh/ecdh-key.service';
import { GenerateEcdhKeyHandler } from './handler/generate-ecdh-key.handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    DidRepositoryModule,
    DdhubClientGatewayEnrolmentModule,
    forwardRef(() => DdhubClientGatewayIdentityModule),
    SymmetricKeysRepositoryModule,
    DdhubClientGatewayMessageBrokerModule,
    SecretsEngineModule,
    DdhubClientGatewayUtilsModule,
    KeyRepositoryModule,
    IterationRepositoryModule,
    CqrsModule,
  ],
  providers: [
    SymmetricKeysCacheService,
    RsaEncryptionService,
    RsaKeyService,
    RsaKdfService,
    EcdhTagService,
    ECDHKdfService,
    EcdhKeyService,
    EcdhEncryptionService,
    GenerateEcdhKeyHandler,
    GenerateMasterSeedHandler,
    EcdhEncryptionService,
  ],
  exports: [
    SymmetricKeysCacheService,
    RsaEncryptionService,
    EcdhEncryptionService,
    ECDHKdfService,
    RsaKeyService,
  ],
})
export class DdhubClientGatewayEncryptionModule {}
