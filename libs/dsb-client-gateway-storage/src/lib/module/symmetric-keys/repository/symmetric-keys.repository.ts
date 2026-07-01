import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SymmetricKeysEntity } from '../entity/symmetric-keys.entity';

@Injectable()
export class SymmetricKeysRepository extends Repository<SymmetricKeysEntity> {
  constructor(dataSource: DataSource) {
    super(SymmetricKeysEntity, dataSource.createEntityManager());
  }
}
