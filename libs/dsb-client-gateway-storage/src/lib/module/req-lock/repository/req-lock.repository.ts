import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ReqLockEntity } from '../entity';

@Injectable()
export class ReqLockRepository extends Repository<ReqLockEntity> {
  constructor(dataSource: DataSource) {
    super(ReqLockEntity, dataSource.createEntityManager());
  }
}
