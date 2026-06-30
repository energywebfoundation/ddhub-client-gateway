import { Injectable } from '@nestjs/common';
import { ApplicationEntity } from '../entity/application.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ApplicationRepository extends Repository<ApplicationEntity> {
  constructor(dataSource: DataSource) {
    super(ApplicationEntity, dataSource.createEntityManager());
  }
}
