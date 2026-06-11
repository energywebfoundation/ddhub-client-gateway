import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ReceivedMessageReadStatusEntity } from '../entity';

@Injectable()
export class ReceivedMessageReadStatusRepository extends Repository<ReceivedMessageReadStatusEntity> {
  constructor(dataSource: DataSource) {
    super(ReceivedMessageReadStatusEntity, dataSource.createEntityManager());
  }
}
