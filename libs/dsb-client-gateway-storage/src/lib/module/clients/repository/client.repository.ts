import { Injectable } from '@nestjs/common';
import { ClientEntity } from '../entity/client.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ClientRepository extends Repository<ClientEntity> {
  constructor(dataSource: DataSource) {
    super(ClientEntity, dataSource.createEntityManager());
  }
}
