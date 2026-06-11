import { Injectable } from '@nestjs/common';
import { DidEntity } from '../entity/did.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class DidRepository extends Repository<DidEntity> {
  constructor(dataSource: DataSource) {
    super(DidEntity, dataSource.createEntityManager());
  }
}
