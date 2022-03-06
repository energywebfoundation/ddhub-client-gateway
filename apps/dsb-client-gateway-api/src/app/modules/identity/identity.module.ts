import { Module } from '@nestjs/common';
import { UtilsModule } from '../utils/utils.module';
import { IdentityService } from './service/identity.service';
import { IdentityController } from './identity.controller';
import { StorageModule } from '../storage/storage.module';
import { SecretsEngineModule } from '../secrets-engine/secrets-engine.module';

@Module({
  imports: [UtilsModule, StorageModule, SecretsEngineModule],
  providers: [IdentityService],
  controllers: [IdentityController]
})
export class IdentityModule {}
