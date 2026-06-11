import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ReceivedMessageEntity } from '../entity';

@Injectable()
export class ReceivedMessageRepository extends Repository<ReceivedMessageEntity> {
  constructor(dataSource: DataSource) {
    super(ReceivedMessageEntity, dataSource.createEntityManager());
  }
}
