import { EntityRepository, Repository } from 'typeorm';
import { ReceivedMessageReadStatusEntity } from '../entity';

@EntityRepository(ReceivedMessageReadStatusEntity)
export class ReceivedMessageReadStatusRepository extends Repository<ReceivedMessageReadStatusEntity> {}
