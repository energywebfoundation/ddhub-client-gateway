import { Module } from '@nestjs/common';
import { KeysService } from './service/keys.service';
import { StorageModule } from '../storage/storage.module';
import { SecretsEngineModule } from '../secrets-engine/secrets-engine.module';
import { KeysController } from './keys.controller';
import { KeysRepository } from './repository/keys.repository';

@Module({
  imports: [StorageModule, SecretsEngineModule],
  providers: [KeysService, KeysRepository],
  controllers: [KeysController],
  exports: [KeysService],
})
export class KeysModule {}
