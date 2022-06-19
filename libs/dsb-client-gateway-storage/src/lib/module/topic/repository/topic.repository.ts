import { EntityRepository, ILike, Like, Repository } from 'typeorm';
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
      skip: (page - 1),
    });
  }

  public async getTopicsAndCount(
    limit: number,
    name: string,
    owner: string,
    page: number,
    tags: string[]
  ): Promise<[TopicEntity[], number]> {

    const query = this.createQueryBuilder('t');
    query.where("t.owner = :owner", { owner: owner });
    query.groupBy("t.id").limit(limit).offset(limit * (page - 1));
    if (name) {
      query.andWhere("t.name = :name", { name: name });
    }

    if (tags && tags.length > 0) {
      query.andWhere("t.tags in :tags", { tags: tags });
    }
    return query.getManyAndCount();
  }

  public async getTopicsAndCountSearch(
    limit: number,
    name: string,
    owner: string,
    page: number
  ): Promise<[TopicEntity[], number]> {
    const query = this.createQueryBuilder('t');
    query.where("t.name like :name", { name: `%${name}%` });
    query.groupBy("t.id").limit(limit).offset(limit * (page - 1));
    if (owner) {
      query.andWhere("t.owner = :owner", { owner: owner });
    }
    return query.getManyAndCount();
  }
}
