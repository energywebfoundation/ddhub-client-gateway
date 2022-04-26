import { EnrolmentEntity } from '../entity/enrolment.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(EnrolmentEntity)
export class EnrolmentRepository extends Repository<EnrolmentEntity> {
  public async createOne(enrolment: EnrolmentEntity): Promise<void> {
    await this.clear();

    await this.save(enrolment);
  }
}
