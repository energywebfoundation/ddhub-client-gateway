import { Injectable } from '@nestjs/common';
import {
  AddressBookEntity,
  AddressBookRepository,
  AddressBookRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';

@Injectable()
export class AddressBookService {
  constructor(
    protected readonly addressBookWrapper: AddressBookRepositoryWrapper
  ) {}

  public async save(did: string, name: string): Promise<void> {
    await this.addressBookWrapper.repository.save({
      did,
      name,
    });
  }

  public async getAll(): Promise<AddressBookEntity[]> {
    return this.addressBookWrapper.repository.find();
  }

  public async delete(did: string): Promise<void> {
    await this.addressBookWrapper.repository.delete({
      did,
    });
  }

  public async update(did: string, newName: string): Promise<void> {
    await this.addressBookWrapper.repository.update(
      {
        did,
      },
      {
        name: newName,
      }
    );
  }
}
