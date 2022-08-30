import { EntityRepository, In, Repository } from 'typeorm';
import { TopicMonitorEntity } from '../entity/topic-monitor.entity';

@EntityRepository(TopicMonitorEntity)
export class TopicMonitorRepository extends Repository<TopicMonitorEntity> {
  public async get(owners: string[]): Promise<TopicMonitorEntity[]> {
    return this.find({
      where: {
        owner: In(owners),
      },
    });
  }
}
