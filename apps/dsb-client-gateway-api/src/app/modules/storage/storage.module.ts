import { Module } from '@nestjs/common';
import { EnrolmentRepository } from './repository/enrolment.repository';
import { IdentityRepository } from './repository/identity.repository';

@Module({
  providers: [EnrolmentRepository, IdentityRepository],
  exports: [EnrolmentRepository, IdentityRepository],
})
export class StorageModule {}
