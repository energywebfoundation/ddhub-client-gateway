import { EntityRepository, Repository } from 'typeorm';
import { SentMessageRecipientEntity } from '../entity';

@EntityRepository(SentMessageRecipientEntity)
export class SentMessageRecipientRepository extends Repository<SentMessageRecipientEntity> {}
