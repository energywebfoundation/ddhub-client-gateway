import { EntityRepository, Repository } from 'typeorm';
import { PendingAcksEntity } from '../entity/pending-acks.entity';

@EntityRepository(PendingAcksEntity)
export class PendingAcksRepository extends Repository<PendingAcksEntity> {}
