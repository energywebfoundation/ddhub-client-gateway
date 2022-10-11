import { EntityRepository, Repository } from 'typeorm';
import { ReqLockEntity } from '../entity';

@EntityRepository(ReqLockEntity)
export class ReqLockRepository extends Repository<ReqLockEntity> {}
