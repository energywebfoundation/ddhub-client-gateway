import { forwardRef, Module } from '@nestjs/common';
import { EnrolmentService } from './service/enrolment.service';
import { EnrolmentController } from './enrolment.controller';
import { UtilsModule } from '../utils/utils.module';
import { StorageModule } from '../storage/storage.module';
import { IdentityModule } from '../identity/identity.module';
import { ClaimListenerService } from './service/claim-listener.service';
import { RoleListenerService } from './service/role-listener.service';
import { EnrolmentRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';

@Module({
  imports: [
    UtilsModule,
    StorageModule,
    forwardRef(() => IdentityModule),
    EnrolmentRepositoryModule,
  ],
  providers: [EnrolmentService, ClaimListenerService, RoleListenerService],
  controllers: [EnrolmentController],
  exports: [EnrolmentService],
})
export class EnrolmentModule {}
