import { forwardRef, Module } from '@nestjs/common';
import { KeysService } from './service/keys.service';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { KeysController } from './keys.controller';
import { KeysRepository } from './repository/keys.repository';
import { IdentityModule } from '../identity/identity.module';
import { DsbClientGatewayStorageModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { SymmetricKeysRepository } from '../message/repository/symmetric-keys.repository';
import { SymmetricKeysCacheService } from '../message/service/symmetric-keys-cache.service';
import { DsbClientModule } from '../dsb-client/dsb-client.module';
import { RefreshKeysHandler } from './service/refresh-keys.handler';
import { StorageModule } from '../storage/storage.module';
@Module({
  imports: [
    DsbClientGatewayStorageModule,
    SecretsEngineModule,
    IdentityModule,
    StorageModule,
    forwardRef(() => DsbClientModule),
  ],
  providers: [
    KeysService,
    KeysRepository,
    SymmetricKeysRepository,
    SymmetricKeysCacheService,
    RefreshKeysHandler,
  ],
  controllers: [KeysController],
  exports: [KeysService],
})
export class KeysModule {}
