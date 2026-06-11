import { Injectable } from '@nestjs/common';
import { EventsEntity } from '../entity/events.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class EventsRepository extends Repository<EventsEntity> {
  constructor(dataSource: DataSource) {
    super(EventsEntity, dataSource.createEntityManager());
  }
}
