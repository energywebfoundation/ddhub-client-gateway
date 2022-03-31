import { Module } from '@nestjs/common';
import { UtilsModule } from '../utils/utils.module';
import { IdentityService } from './service/identity.service';
import { IdentityController } from './identity.controller';
import { StorageModule } from '../storage/storage.module';
import { SecretsEngineModule } from '../secrets-engine/secrets-engine.module';
import { EnrolmentModule } from '../enrolment/enrolment.module';

@Module({
  imports: [UtilsModule, StorageModule, SecretsEngineModule, EnrolmentModule],
  providers: [IdentityService],
  controllers: [IdentityController],
  exports: [IdentityService],
})
export class IdentityModule {}
