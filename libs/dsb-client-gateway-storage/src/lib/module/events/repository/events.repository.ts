import { EventsEntity } from '../entity/events.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(EventsEntity)
export class EventsRepository extends Repository<EventsEntity> {}
