import { Module } from '@nestjs/common';
import { KeysService } from './service/keys.service';
import { StorageModule } from '../storage/storage.module';
import { SecretsEngineModule } from '../secrets-engine/secrets-engine.module';
import { KeysController } from './keys.controller';
import { KeysRepository } from './repository/keys.repository';
import { IdentityModule } from '../identity/identity.module';

@Module({
  imports: [StorageModule, SecretsEngineModule, IdentityModule],
  providers: [KeysService, KeysRepository],
  controllers: [KeysController],
  exports: [KeysService],
})
export class KeysModule {}
