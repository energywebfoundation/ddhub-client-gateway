import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { TopicEntity } from '../entity/topic.entity';

@EntityRepository(TopicEntity)
export class TopicRepository extends Repository<TopicEntity> {
  public async getTopicsAndCountSearch(
    limit: number,
    name: string,
    owner: string,
    page: number
  ): Promise<[TopicEntity[], number]> {
    const query = this.createQueryBuilder('t');
    query.where('t.name like :name', { name: `%${name}%` });
    query
      .groupBy('t.id')
      .limit(limit)
      .offset(limit * (page - 1));
    if (owner) {
      query.andWhere('t.owner = :owner', { owner: owner });
    }
    return query.getManyAndCount();
  }

  public async getCountOfLatest(
    name: string,
    owner: string,
    tags: string[]
  ): Promise<number> {
    const subQuery = this.getLatestVersionsQuery(owner, name, tags);

    const [query, params] = subQuery.getQueryAndParameters();

    const result = await this.query(
      `SELECT COUNT(*) as count FROM (${query}) t`,
      params
    );

    if (Array.isArray(result) && result.length) {
      return result[0].count;
    }

    return 0;
  }

  public async getLatest(
    limit: number,
    name: string,
    owner: string,
    page: number,
    tags: string[]
  ): Promise<any[]> {
    // @TODO - type
    const query = this.getLatestVersionsQuery(owner, name, tags);

    query.skip(limit * (page === 1 ? 0 : page - 1)).take(limit);

    const result = await query.execute();

    return result.map((rawEntity) => {
      delete rawEntity['castedVersion'];

      return {
        name: rawEntity.name,
        schemaType: rawEntity.schemaType,
        tags: JSON.parse(rawEntity.tags),
        owner: rawEntity.owner,
        id: rawEntity.id,
        version: rawEntity.version,
      };
    });
  }

  protected getLatestVersionsQuery(
    owner: string,
    name: string,
    tags: string[]
  ): SelectQueryBuilder<TopicEntity> {
    const query = this.createQueryBuilder();

    query.select('e.*');

    query.from((qb) => {
      qb.from(TopicEntity, 't');

      if (owner) {
        qb.where('owner = :owner', { owner });
      }

      if (name) {
        qb.andWhere('name = :name', { name });
      }

      if (tags && tags.length) {
        let tagQueryString = '(';

        tags.forEach((tag, index) => {
          if (index === 0) {
            tagQueryString += ` '"' || tags || '"' LIKE '%${tag}%' `;

            return;
          }

          tagQueryString += ` OR '"' || tags || '"' LIKE '%${tag}%' `;
        });

        qb.andWhere(tagQueryString + ')');
      }

      return qb;
    }, 'e');

    query.groupBy('e.name').addGroupBy('e.owner');

    return query;
  }
}
