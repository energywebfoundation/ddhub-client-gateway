import { EntityRepository, Repository } from 'typeorm';
import { ReceivedMessageEntity } from '../entity';

@EntityRepository(ReceivedMessageEntity)
export class ReceivedMessageRepository extends Repository<ReceivedMessageEntity> {}
