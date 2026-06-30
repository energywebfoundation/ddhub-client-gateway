import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { TopicMonitorEntity } from '../entity/topic-monitor.entity';

@Injectable()
export class TopicMonitorRepository extends Repository<TopicMonitorEntity> {
  constructor(dataSource: DataSource) {
    super(TopicMonitorEntity, dataSource.createEntityManager());
  }

  public async get(owners: string[]): Promise<TopicMonitorEntity[]> {
    return this.find({
      where: {
        owner: In(owners),
      },
    });
  }
}
