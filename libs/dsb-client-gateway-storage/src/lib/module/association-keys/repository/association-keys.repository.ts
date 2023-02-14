import { AssociationKeyEntity } from '../entity/association-key.entity';
import { EntityRepository, MoreThan, Repository } from 'typeorm';

@EntityRepository(AssociationKeyEntity)
export class AssociationKeysRepository extends Repository<AssociationKeyEntity> {
  public async get(date: Date): Promise<AssociationKeyEntity | undefined> {
    const query = this.createQueryBuilder('tbl');

    query
      .where(':date BETWEEN tbl.validFrom AND tbl.validTo')
      .orderBy()
      .limit(1)
      .setParameter('date', date);

    return query.getOne();
  }

  public async getNext(date: Date): Promise<AssociationKeyEntity | undefined> {
    return this.findOne({
      where: {
        validFrom: MoreThan(date),
      },
      order: {
        validFrom: 'ASC',
      },
    });
  }
}
