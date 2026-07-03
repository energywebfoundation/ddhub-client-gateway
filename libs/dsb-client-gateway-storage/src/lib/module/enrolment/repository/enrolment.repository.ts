import { Injectable } from '@nestjs/common';
import { EnrolmentEntity } from '../entity/enrolment.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class EnrolmentRepository extends Repository<EnrolmentEntity> {
  constructor(dataSource: DataSource) {
    super(EnrolmentEntity, dataSource.createEntityManager());
  }

  public async createOne(enrolment: EnrolmentEntity): Promise<void> {
    await this.clear();

    await this.save(enrolment);
  }
}
