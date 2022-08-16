import { KeyEntity } from '../entity/key.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(KeyEntity)
export class KeyRepository extends Repository<KeyEntity> {}
