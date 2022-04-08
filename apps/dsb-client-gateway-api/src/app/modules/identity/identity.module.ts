import { Module } from '@nestjs/common';
import { UtilsModule } from '../utils/utils.module';
import { IdentityService } from './service/identity.service';
import { IdentityController } from './identity.controller';
import { StorageModule } from '../storage/storage.module';
import { EnrolmentModule } from '../enrolment/enrolment.module';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { IamInitService } from './service/iam-init.service';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    UtilsModule,
    StorageModule,
    SecretsEngineModule,
    EnrolmentModule,
    CqrsModule,
  ],
  providers: [IdentityService, IamInitService],
  controllers: [IdentityController],
  exports: [IdentityService, IamInitService],
})
export class IdentityModule {}
