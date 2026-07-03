import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ReceivedMessageMappingEntity } from '../entity';

@Injectable()
export class ReceivedMessageMappingRepository extends Repository<ReceivedMessageMappingEntity> {
  constructor(dataSource: DataSource) {
    super(ReceivedMessageMappingEntity, dataSource.createEntityManager());
  }
}
