import { DidEntity } from '../entity/did.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(DidEntity)
export class DidRepository extends Repository<DidEntity> {}
