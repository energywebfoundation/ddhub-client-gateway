import { EntityRepository, Repository } from 'typeorm';
import { AcksEntity } from '../entity';

@EntityRepository(AcksEntity)
export class AcksRepository extends Repository<AcksEntity> { }
