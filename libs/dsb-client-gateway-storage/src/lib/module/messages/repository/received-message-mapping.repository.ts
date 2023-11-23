import { EntityRepository, Repository } from 'typeorm';
import { ReceivedMessageMappingEntity } from '../entity';

@EntityRepository(ReceivedMessageMappingEntity)
export class ReceivedMessageMappingRepository extends Repository<ReceivedMessageMappingEntity> {}
