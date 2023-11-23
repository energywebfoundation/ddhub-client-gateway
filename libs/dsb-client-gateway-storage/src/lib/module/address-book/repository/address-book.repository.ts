import { EntityRepository, Repository } from 'typeorm';
import { AddressBookEntity } from '../entity';

@EntityRepository(AddressBookEntity)
export class AddressBookRepository extends Repository<AddressBookEntity> {}
