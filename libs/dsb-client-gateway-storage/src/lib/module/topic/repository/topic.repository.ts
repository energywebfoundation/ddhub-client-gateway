import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { TopicEntity } from '../entity/topic.entity';

@EntityRepository(TopicEntity)
export class TopicRepository extends Repository<TopicEntity> {
  public async getTopicsAndCountSearch(
    limit: number,
    name: string,
    owner: string,
    page: number
  ): Promise<TopicEntity[]> {
    const query = this.createQueryBuilder('t');
    query.select('t.*');
    query.distinctOn(['t.id']);
    query.where('t.name like :name', { name: `%${name}%` });
    query
      .limit(limit)
      .offset(limit * (page - 1));
    if (owner) {
      query.andWhere('t.owner = :owner', { owner: owner });
    }
    query.orderBy("t.id,t.version", "DESC");
    const result = await query.execute();
    return result.map((rawEntity) => {
      return {
        name: rawEntity.name,
        schemaType: rawEntity.schemaType,
        tags: JSON.parse(rawEntity.tags),
        owner: rawEntity.owner,
        schema: JSON.parse(rawEntity.schema),
        id: rawEntity.id,
        version: rawEntity.version,
      };
    });
  }

  public async getTopicsCountSearch(
    name: string,
    owner: string,
  ): Promise<number> {
    const query = this.createQueryBuilder('t');
    query.select('t.*');
    query.distinctOn(['t.id']);
    query.where('t.name like :name', { name: `%${name}%` });
    if (owner) {
      query.andWhere('t.owner = :owner', { owner: owner });
    }
    query.orderBy("t.id,t.version", "DESC");
    return (await query.getRawMany()).length;
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

  public async getOne(
    name: string,
    owner: string
  ): Promise<TopicEntity | null> {
    const query: TopicEntity[] = await this.getLatest(
      1,
      name,
      owner,
      1,
      undefined
    );

    if (!query.length) {
      return null;
    }

    return query[0];
  }

  public async getLatest(
    limit: number,
    name: string,
    owner: string,
    page: number,
    tags: string[]
  ): Promise<TopicEntity[]> {
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
        schema: JSON.parse(rawEntity.schema),
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
    const qb = this.createQueryBuilder("t");

    qb.select('t.*')
    qb.distinctOn(['id'])
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
    qb.orderBy("id,version", "DESC");
    return qb;
  }
}
