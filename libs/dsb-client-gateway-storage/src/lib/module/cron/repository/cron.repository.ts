import { Injectable } from '@nestjs/common';
import { CronEntity } from '../entity/cron.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CronRepository extends Repository<CronEntity> {
  constructor(dataSource: DataSource) {
    super(CronEntity, dataSource.createEntityManager());
  }
}
