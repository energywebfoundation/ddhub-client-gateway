import { IterationEntity } from '../entity/iteration.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(IterationEntity)
export class IterationRepository extends Repository<IterationEntity> {
  public async getLatest(dateUtc: string): Promise<IterationEntity | null> {
    return this.findOne({
      where: {
        dateUtc,
      },
      order: {
        iteration: 'DESC',
      },
    });
  }
}
