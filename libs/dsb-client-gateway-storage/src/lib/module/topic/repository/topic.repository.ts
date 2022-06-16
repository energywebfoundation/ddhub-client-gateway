import { EntityRepository, Repository } from 'typeorm';
import { TopicEntity } from '../entity/topic.entity';

@EntityRepository(TopicEntity)
export class TopicRepository extends Repository<TopicEntity> {
  public async getCountOfLatest(
    name: string,
    owner: string,
    tags: string[]
  ): Promise<number> {
    const query = this.createQueryBuilder('t');

    if (name) {
      query.where('t.name = :name', { name });
    }

    if (owner) {
      query.where('t.owner = :owner', { owner });
    }

    if (tags && tags.length) {
      for (const tag of tags) {
        query.where(` '"' || tags || '"' LIKE '%:tag%' `, { tag });
      }
    }

    query.groupBy('t.name').addGroupBy('t.owner');

    return query.getCount();
  }

  public async getLatest(
    limit: number,
    name: string,
    owner: string,
    page: number,
    tags: string[]
  ): Promise<any> {
    const query = this.createQueryBuilder('t');

    if (name) {
      query.where('t.name = :name', { name });
    }

    if (owner) {
      query.where('t.owner = :owner', { owner });
    }

    if (tags && tags.length) {
      for (const tag of tags) {
        query.where(` '"' || tags || '"' LIKE '%:tag%' `, { tag });
      }
    }

    query.groupBy('t.name').addGroupBy('t.owner');
    query.limit(limit).skip(limit * (page - 1));

    return query.getMany();
  }
}
