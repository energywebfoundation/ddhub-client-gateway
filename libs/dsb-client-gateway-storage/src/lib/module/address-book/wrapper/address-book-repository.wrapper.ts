import { Injectable } from '@nestjs/common';
import { AddressBookRepository } from '../repository';

@Injectable()
export class AddressBookRepositoryWrapper {
  constructor(public readonly repository: AddressBookRepository) {}
}
