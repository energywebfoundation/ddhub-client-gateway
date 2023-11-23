import { EntityRepository, Repository } from 'typeorm';
import { SentMessageEntity } from '../entity';

@EntityRepository(SentMessageEntity)
export class SentMessageRepository extends Repository<SentMessageEntity> {}
