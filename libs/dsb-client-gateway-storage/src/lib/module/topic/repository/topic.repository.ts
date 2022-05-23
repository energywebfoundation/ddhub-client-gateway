import { EntityRepository, Repository } from 'typeorm';
import { TopicEntity } from '../entity/topic.entity';

@EntityRepository(TopicEntity)
export class TopicRepository extends Repository<TopicEntity> {
  public async getTopics(
    limit: number,
    name: string,
    owner: string,
    page: number,
    tags: string[]
  ): Promise<TopicEntity[]> {
    return this.find({
      where: {
        ...(name ? { name } : null),
        ...(owner ? { owner } : null),
        ...(tags ? { tags } : null),
      },
      take: limit,
      skip: page,
    });
  }
}
