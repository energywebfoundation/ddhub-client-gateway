import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrolmentEntity } from './entity/enrolment.entity';
import { EnrolmentRepository } from './repository/enrolment.repository';
import { EnrolmentWrapperRepository } from './wrapper/enrolment-wrapper.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EnrolmentEntity, EnrolmentRepository])],
  providers: [EnrolmentWrapperRepository],
  exports: [EnrolmentWrapperRepository],
})
export class EnrolmentRepositoryModule {}
