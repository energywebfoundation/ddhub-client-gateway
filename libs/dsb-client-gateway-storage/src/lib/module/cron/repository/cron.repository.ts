import { CronEntity } from '../entity/cron.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(CronEntity)
export class CronRepository extends Repository<CronEntity> {}
