import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AcksEntity } from '../entity';

@Injectable()
export class AcksRepository extends Repository<AcksEntity> {
  constructor(dataSource: DataSource) {
    super(AcksEntity, dataSource.createEntityManager());
  }
 }
