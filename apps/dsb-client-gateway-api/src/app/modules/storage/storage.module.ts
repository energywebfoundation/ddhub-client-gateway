import { Module } from '@nestjs/common';
import { EnrolmentRepository } from './repository/enrolment.repository';
import { IdentityRepository } from './repository/identity.repository';
import { DsbClientGatewayStorageModule } from '@dsb-client-gateway/dsb-client-gateway-storage';

@Module({
  imports: [DsbClientGatewayStorageModule],
  providers: [EnrolmentRepository, IdentityRepository],
  exports: [EnrolmentRepository, IdentityRepository],
})
export class StorageModule {}
