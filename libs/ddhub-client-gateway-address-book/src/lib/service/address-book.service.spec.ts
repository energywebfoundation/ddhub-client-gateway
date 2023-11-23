import { AddressBookRepositoryWrapper } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { Test, TestingModule } from '@nestjs/testing';
import { AddressBookService } from './address-book.service';

const mockAddressBookRepositoryWrapper = {
  repository: {
    save: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
};

describe('AddressBookService', () => {
  let addressBookService: AddressBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressBookService,
        {
          provide: AddressBookRepositoryWrapper,
          useValue: mockAddressBookRepositoryWrapper,
        },
      ],
    }).compile();

    addressBookService = module.get<AddressBookService>(AddressBookService);
  });

  it('should be defined', () => {
    expect(addressBookService).toBeDefined();
  });

  describe('save', () => {
    it('should save an address book entry', async () => {
      const did = 'exampleDid';
      const name = 'John Doe';

      await addressBookService.save(did, name);

      expect(
        mockAddressBookRepositoryWrapper.repository.save,
      ).toHaveBeenCalledWith({
        did,
        name,
      });
    });
  });

  describe('getAll', () => {
    it('should return all address book entries', async () => {
      const addressBookEntries = [
        { did: '1', name: 'John' },
        { did: '2', name: 'Jane' },
      ];
      mockAddressBookRepositoryWrapper.repository.find.mockReturnValue(
        addressBookEntries,
      );

      const result = await addressBookService.getAll();

      expect(result).toEqual(addressBookEntries);
    });
  });

  describe('delete', () => {
    it('should delete an address book entry', async () => {
      const did = 'exampleDid';

      await addressBookService.delete(did);

      expect(
        mockAddressBookRepositoryWrapper.repository.delete,
      ).toHaveBeenCalledWith({ did });
    });
  });

  describe('update', () => {
    it('should update the name of an address book entry', async () => {
      const did = 'exampleDid';
      const newName = 'New Name';

      await addressBookService.update(did, newName);

      expect(
        mockAddressBookRepositoryWrapper.repository.update,
      ).toHaveBeenCalledWith({ did }, { name: newName });
    });
  });
});
