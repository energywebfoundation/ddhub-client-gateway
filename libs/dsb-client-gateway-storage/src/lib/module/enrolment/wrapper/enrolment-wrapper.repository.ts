import { Injectable } from '@nestjs/common';
import { EnrolmentRepository } from '../repository/enrolment.repository';

@Injectable()
export class EnrolmentWrapperRepository {
  constructor(public readonly enrolmentRepository: EnrolmentRepository) {}
}
