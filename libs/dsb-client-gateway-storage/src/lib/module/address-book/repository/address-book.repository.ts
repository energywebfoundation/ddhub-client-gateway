import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AddressBookEntity } from '../entity';

@Injectable()
export class AddressBookRepository extends Repository<AddressBookEntity> {
  constructor(dataSource: DataSource) {
    super(AddressBookEntity, dataSource.createEntityManager());
  }
}
