import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SentMessageRecipientEntity } from '../entity';

@Injectable()
export class SentMessageRecipientRepository extends Repository<SentMessageRecipientEntity> {
  constructor(dataSource: DataSource) {
    super(SentMessageRecipientEntity, dataSource.createEntityManager());
  }
}
