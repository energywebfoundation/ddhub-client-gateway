import { ApplicationEntity } from '../entity/application.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ApplicationEntity)
export class ApplicationRepository extends Repository<ApplicationEntity> {}
