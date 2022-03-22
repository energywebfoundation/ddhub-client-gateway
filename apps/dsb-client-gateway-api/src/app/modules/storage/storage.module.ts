import { Module } from '@nestjs/common';
import { EnrolmentRepository } from './repository/enrolment.repository';
import { IdentityRepository } from './repository/identity.repository';
import { LokiService } from './service/loki.service';

@Module({
  providers: [EnrolmentRepository, IdentityRepository, LokiService],
  exports: [EnrolmentRepository, IdentityRepository, LokiService],
})
export class StorageModule {}
