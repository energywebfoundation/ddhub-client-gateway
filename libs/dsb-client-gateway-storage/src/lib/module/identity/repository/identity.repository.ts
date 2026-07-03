import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { IdentityEntity } from '../entity/identity.entity';

@Injectable()
export class IdentityRepository extends Repository<IdentityEntity> {
  constructor(dataSource: DataSource) {
    super(IdentityEntity, dataSource.createEntityManager());
  }

  public async createOne(identity: IdentityEntity): Promise<void> {
    await this.clear();

    await this.save(identity);
  }
}
