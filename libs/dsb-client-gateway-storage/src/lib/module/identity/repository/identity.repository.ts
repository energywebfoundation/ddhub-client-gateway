import { EntityRepository, Repository } from 'typeorm';
import { IdentityEntity } from '../entity/identity.entity';

@EntityRepository(IdentityEntity)
export class IdentityRepository extends Repository<IdentityEntity> {
  public async createOne(identity: IdentityEntity): Promise<void> {
    await this.clear();

    await this.save(identity);
  }
}
