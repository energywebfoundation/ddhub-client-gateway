import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SentMessageEntity } from '../entity';

@Injectable()
export class SentMessageRepository extends Repository<SentMessageEntity> {
  constructor(dataSource: DataSource) {
    super(SentMessageEntity, dataSource.createEntityManager());
  }
}
