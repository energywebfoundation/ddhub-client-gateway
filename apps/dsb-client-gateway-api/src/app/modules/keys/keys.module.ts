import { forwardRef, Module } from '@nestjs/common';
import { KeysService } from './service/keys.service';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { KeysController } from './keys.controller';
import { IdentityModule } from '../identity/identity.module';
import {
  DidRepositoryModule,
  DsbClientGatewayStorageModule,
  SymmetricKeysRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { SymmetricKeysCacheService } from '../message/service/symmetric-keys-cache.service';
import { DsbClientModule } from '../dsb-client/dsb-client.module';
import { RefreshKeysHandler } from './service/refresh-keys.handler';
import { StorageModule } from '../storage/storage.module';
import { EnrolmentModule } from '../enrolment/enrolment.module';

@Module({
  imports: [
    DsbClientGatewayStorageModule,
    SecretsEngineModule,
    SymmetricKeysRepositoryModule,
    IdentityModule,
    EnrolmentModule,
    StorageModule,
    DidRepositoryModule,
    forwardRef(() => DsbClientModule),
  ],
  providers: [KeysService, SymmetricKeysCacheService, RefreshKeysHandler],
  controllers: [KeysController],
  exports: [KeysService],
})
export class KeysModule {}
