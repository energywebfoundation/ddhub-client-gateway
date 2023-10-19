import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import {
  ClientEntity,
  ClientWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import {
  DdhubConfigService,
  DdhubClientsService,
  ConfigDto,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { MaximumNumberOfClientsReachedException } from '@dsb-client-gateway/ddhub-client-gateway-clients';

const mockClientWrapperRepository = {
  repository: {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
  },
};

const mockDdhubConfigService = {
  getConfig: jest.fn(),
};

const mockDdhubClientsService = {
  getClients: jest.fn(),
  deleteClients: jest.fn(),
};

const mockIamService = {
  getDIDAddress: jest.fn(),
};

describe('ClientsService', () => {
  let clientsService: ClientsService;
  let error: Error | null;
  let result: unknown | null;

  beforeEach(async () => {
    jest.resetAllMocks();

    error = null;
    result = null;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: ClientWrapperRepository,
          useValue: mockClientWrapperRepository,
        },
        {
          provide: DdhubConfigService,
          useValue: mockDdhubConfigService,
        },
        {
          provide: DdhubClientsService,
          useValue: mockDdhubClientsService,
        },
        {
          provide: IamService,
          useValue: mockIamService,
        },
      ],
    }).compile();

    clientsService = module.get<ClientsService>(ClientsService);
  });

  it('should be defined', () => {
    expect(clientsService).toBeDefined();
  });

  describe('upsert()', () => {
    describe('should create client', () => {
      beforeEach(async () => {
        mockDdhubConfigService.getConfig = jest
          .fn()
          .mockImplementation(async () => {
            return {
              fileMaxSize: 1,
              msgExpired: 1,
              msgMaxSize: 1,
              natsMaxClientidSize: 2,
            } as ConfigDto;
          });

        mockClientWrapperRepository.repository.save = jest
          .fn()
          .mockImplementationOnce(async () => ({}));

        mockClientWrapperRepository.repository.count = jest
          .fn()
          .mockImplementationOnce(async () => 0);

        mockClientWrapperRepository.repository.findOne = jest
          .fn()
          .mockImplementationOnce(async () => {
            return null;
          });

        try {
          await clientsService.upsert('client');
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should create client', () => {
        expect(mockClientWrapperRepository.repository.save).toBeCalledTimes(1);
        expect(mockClientWrapperRepository.repository.save).toBeCalledWith({
          clientId: 'client',
        });
      });
    });

    describe('should update client', () => {
      beforeEach(async () => {
        mockDdhubConfigService.getConfig = jest
          .fn()
          .mockImplementation(async () => {
            return {
              fileMaxSize: 1,
              msgExpired: 1,
              msgMaxSize: 1,
              natsMaxClientidSize: 2,
            } as ConfigDto;
          });

        mockClientWrapperRepository.repository.count = jest
          .fn()
          .mockImplementationOnce(async () => 0);

        mockClientWrapperRepository.repository.findOne = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              clientId: 'clientId',
              createdDate: new Date(),
              updatedDate: new Date(),
            } as ClientEntity;
          });

        try {
          await clientsService.upsert('clientId');
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should not create client', () => {
        expect(mockClientWrapperRepository.repository.save).toBeCalledTimes(0);
      });

      it('should update client', () => {
        expect(mockClientWrapperRepository.repository.update).toBeCalledTimes(
          1
        );
        expect(mockClientWrapperRepository.repository.update).toBeCalledWith(
          {
            clientId: 'clientId',
          },
          {
            clientId: 'clientId',
          }
        );
      });
    });
  });

  describe('syncMissingClientsIds()', () => {
    describe('should sync missing clients', () => {
      beforeEach(async () => {
        mockIamService.getDIDAddress = jest
          .fn()
          .mockImplementationOnce(async () => 'did');

        mockDdhubClientsService.getClients = jest
          .fn()
          .mockImplementationOnce(async () => ['client1', 'client2']);

        mockClientWrapperRepository.repository.find = jest
          .fn()
          .mockImplementationOnce(async () => [
            {
              clientId: 'client1',
            },
          ]);

        try {
          await clientsService.syncMissingClientsIds();
        } catch (e) {
          error = e;
        }
      });

      it('should not synchronize only one client', () => {
        expect(mockClientWrapperRepository.repository.save).toBeCalledTimes(1);
        expect(mockClientWrapperRepository.repository.save).toBeCalledWith({
          clientId: 'client2',
        });
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });
    });
  });

  describe('canUse()', () => {
    describe('should allow to use client', () => {
      beforeEach(async () => {
        mockClientWrapperRepository.repository.count = jest
          .fn()
          .mockImplementationOnce(async () => 1);

        try {
          result = await clientsService.canUse('clientId');
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
      });

      it('should be able to use client', () => {
        expect(result).toBeTruthy();
      });

      it('should call repository count', () => {
        expect(mockClientWrapperRepository.repository.count).toBeCalledTimes(1);
        expect(mockClientWrapperRepository.repository.count).toBeCalledWith({
          where: {
            clientId: 'clientId',
          },
        });
      });
    });
  });

  describe('attemptCreateClient()', () => {
    describe('should create client', () => {
      beforeEach(async () => {
        mockClientWrapperRepository.repository.count = jest
          .fn()
          .mockImplementationOnce(async () => 1);

        mockClientWrapperRepository.repository.save = jest
          .fn()
          .mockImplementationOnce(async () => {});

        mockDdhubConfigService.getConfig = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              fileMaxSize: 1,
              msgExpired: 1,
              msgMaxSize: 1,
              natsMaxClientidSize: 2,
            } as ConfigDto;
          });

        try {
          await clientsService.attemptCreateClient('clientId');
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should store client', () => {
        expect(mockClientWrapperRepository.repository.save).toBeCalledTimes(1);
        expect(mockClientWrapperRepository.repository.save).toBeCalledWith({
          clientId: 'clientId',
        });
      });

      it('should call repository for count of existing clients', () => {
        expect(mockClientWrapperRepository.repository.count).toBeCalledTimes(1);
      });

      it('should call ddhub client config', () => {
        expect(mockDdhubConfigService.getConfig).toBeCalledTimes(1);
      });
    });

    describe('should not create client as maximum amount is reached', () => {
      beforeEach(async () => {
        mockClientWrapperRepository.repository.count = jest
          .fn()
          .mockImplementationOnce(async () => 1);

        mockDdhubConfigService.getConfig = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              fileMaxSize: 1,
              msgExpired: 1,
              msgMaxSize: 1,
              natsMaxClientidSize: 1,
            } as ConfigDto;
          });

        try {
          await clientsService.attemptCreateClient('clientId');
        } catch (e) {
          error = e;
        }
      });

      it('should not execute', () => {
        expect(error).toBeInstanceOf(MaximumNumberOfClientsReachedException);
      });

      it('should call repository for count of existing clients', () => {
        expect(mockClientWrapperRepository.repository.count).toBeCalledTimes(1);
      });

      it('should call ddhub client config', () => {
        expect(mockDdhubConfigService.getConfig).toBeCalledTimes(1);
      });
    });
  });

  describe('deleteMany()', () => {
    describe('should delete clients', () => {
      beforeEach(async () => {
        try {
          await clientsService.deleteMany(['id1']);
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should call repository', () => {
        expect(mockClientWrapperRepository.repository.delete).toBeCalledTimes(
          1
        );
      });

      it('should call delete clients', () => {
        expect(mockDdhubClientsService.deleteClients).toBeCalledTimes(1);
        expect(mockDdhubClientsService.deleteClients).toBeCalledWith(['id1']);
      });
    });
  });
});
