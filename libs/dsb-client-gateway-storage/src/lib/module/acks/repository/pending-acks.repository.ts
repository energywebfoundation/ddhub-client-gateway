import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PendingAcksEntity } from '../entity/pending-acks.entity';

@Injectable()
export class PendingAcksRepository extends Repository<PendingAcksEntity> {
  constructor(dataSource: DataSource) {
    super(PendingAcksEntity, dataSource.createEntityManager());
  }
 }
