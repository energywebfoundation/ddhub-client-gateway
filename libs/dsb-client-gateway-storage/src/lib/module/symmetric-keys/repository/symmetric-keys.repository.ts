import { EntityRepository, Repository } from 'typeorm';
import { SymmetricKeysEntity } from '../entity/symmetric-keys.entity';

@EntityRepository(SymmetricKeysEntity)
export class SymmetricKeysRepository extends Repository<SymmetricKeysEntity> {}
