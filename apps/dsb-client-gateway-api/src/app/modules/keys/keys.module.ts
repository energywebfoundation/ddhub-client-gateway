import { forwardRef, Module } from '@nestjs/common';
import { KeysService } from './service/keys.service';
import { StorageModule } from '../storage/storage.module';
import { SecretsEngineModule } from '../secrets-engine/secrets-engine.module';
import { KeysController } from './keys.controller';
import { KeysRepository } from './repository/keys.repository';
import { IdentityModule } from '../identity/identity.module';
import { SymmetricKeysRepository } from '../message/repository/symmetric-keys.repository';
import { SymmetricKeysCacheService } from '../message/service/symmetric-keys-cache.service';
import { DsbClientModule } from '../dsb-client/dsb-client.module';

@Module({
  imports: [
    StorageModule,
    SecretsEngineModule,
    IdentityModule,
    forwardRef(() => DsbClientModule),
  ],
  providers: [
    KeysService,
    KeysRepository,
    SymmetricKeysRepository,
    SymmetricKeysCacheService,
  ],
  controllers: [KeysController],
  exports: [KeysService],
})
export class KeysModule {}
