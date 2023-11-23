import { Test, TestingModule } from '@nestjs/testing';
import { SymmetricKeysCacheService } from './symmetric-keys-cache.service';
import { EnrolmentService } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import {
  EnrolmentEntity,
  SymmetricKeysRepositoryWrapper,
  SymmetricKeysEntity,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ConfigService } from '@nestjs/config';
import {
  DdhubMessagesService,
  DdhubConfigService,
  GetInternalMessageResponse,
  SymmetricKeyEntity,
  ConfigDto,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { IdentityService } from '@dsb-client-gateway/ddhub-client-gateway-identity';
import { symlink } from 'mock-fs';
import moment from 'moment';

const mockEnrolmentService = {
  get: jest.fn(),
};

const mockIamService = {
  isInitialized: jest.fn(),
};

const mockSymmetricKeysRepositoryWrapper = {
  symmetricKeysRepository: {
    createQueryBuilder: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
  },
};

const mockConfigService = {
  get: jest.fn(),
};

const mockDdhubMessagesService = {
  getSymmetricKeys: jest.fn(),
};

const mockDdhubConfigService = {
  getConfig: jest.fn(),
};

const mockIdentityService = {
  identityReady: jest.fn(),
};

describe('SymmetricKeysCacheService', () => {
  let service: SymmetricKeysCacheService;
  let error: Error | null;
  let result: unknown | null;

  beforeEach(async () => {
    jest.resetAllMocks();

    error = null;
    result = null;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SymmetricKeysCacheService,
        {
          provide: EnrolmentService,
          useValue: mockEnrolmentService,
        },
        {
          provide: IamService,
          useValue: mockIamService,
        },
        {
          provide: SymmetricKeysRepositoryWrapper,
          useValue: mockSymmetricKeysRepositoryWrapper,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: DdhubMessagesService,
          useValue: mockDdhubMessagesService,
        },
        {
          provide: DdhubConfigService,
          useValue: mockDdhubConfigService,
        },
        {
          provide: IdentityService,
          useValue: mockIdentityService,
        },
      ],
    }).compile();

    service = module.get<SymmetricKeysCacheService>(SymmetricKeysCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteExpiredKeys()', () => {
    describe('should delete one expired key', () => {
      beforeEach(async () => {
        mockDdhubConfigService.getConfig = jest
          .fn()
          .mockImplementation(async () => {
            return {
              msgExpired: 3600,
              natsMaxClientidSize: 1,
              msgMaxSize: 1,
              fileMaxSize: 1,
            } as ConfigDto;
          });

        mockSymmetricKeysRepositoryWrapper.symmetricKeysRepository.createQueryBuilder =
          jest.fn().mockImplementation(() => {
            return {
              stream: () => {
                return [
                  {
                    SymmetricKeysEntity_id: 'id1',
                    SymmetricKeysEntity_clientGatewayMessageId: 'cgwId',
                    SymmetricKeysEntity_payload: 'toDelete',
                    SymmetricKeysEntity_senderDid: 'senderDid',
                    SymmetricKeysEntity_createdDate: moment()
                      .utc()
                      .subtract(1, 'day')
                      .toDate(),
                    SymmetricKeysEntity_updatedDate: moment()
                      .utc()
                      .subtract(1, 'day')
                      .toDate(),
                  },
                  {
                    SymmetricKeysEntity_id: 'id2',
                    SymmetricKeysEntity_clientGatewayMessageId: 'cgwId2',
                    SymmetricKeysEntity_payload: 'toStore',
                    SymmetricKeysEntity_senderDid: 'senderDid',
                    SymmetricKeysEntity_createdDate: moment().toDate(),
                    SymmetricKeysEntity_updatedDate: moment()
                      .add(1, 'day')
                      .toDate(),
                  },
                ];
              },
            };
          });

        try {
          await service.deleteExpiredKeys();
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should call config', () => {
        expect(mockDdhubConfigService.getConfig).toBeCalledTimes(1);
      });

      it('should delete one expired key', () => {
        expect(
          mockSymmetricKeysRepositoryWrapper.symmetricKeysRepository.delete,
        ).toBeCalledTimes(1);
        expect(
          mockSymmetricKeysRepositoryWrapper.symmetricKeysRepository.delete,
        ).toBeCalledWith({
          id: 'id1',
        });
      });
    });
  });

  describe('refreshSymmetricKeysCache()', () => {
    describe('should update cache', () => {
      beforeEach(async () => {
        mockIamService.isInitialized = jest
          .fn()
          .mockImplementationOnce(() => true);

        mockIdentityService.identityReady = jest
          .fn()
          .mockImplementationOnce(async () => true);

        mockEnrolmentService.get = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              did: 'did',
              roles: [],
            } as EnrolmentEntity;
          });

        mockConfigService.get = jest.fn().mockImplementation((name: string) => {
          if (name === 'SYMMETRIC_KEY_CLIENT_ID') {
            return 'symmetricKeysClientId';
          } else {
            return 5;
          }
        });

        mockDdhubMessagesService.getSymmetricKeys = jest
          .fn()
          .mockImplementationOnce(async () => {
            return [
              {
                clientGatewayMessageId: 'cgwId',
                payload: 'payload',
                isFile: false,
                senderDid: 'senderDid',
              },
            ] as GetInternalMessageResponse[];
          });

        try {
          await service.refreshSymmetricKeysCache();
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should call iam service to check for initialization', () => {
        expect(mockIamService.isInitialized).toBeCalledTimes(1);
      });

      it('should call identity service to confirm identity', () => {
        expect(mockIdentityService.identityReady).toBeCalledTimes(1);
      });

      it('should call enrolment service to check if it was created', () => {
        expect(mockEnrolmentService.get).toBeCalledTimes(1);
      });

      it('should save symmetric key', () => {
        expect(
          mockSymmetricKeysRepositoryWrapper.symmetricKeysRepository.save,
        ).toBeCalledTimes(1);
        expect(
          mockSymmetricKeysRepositoryWrapper.symmetricKeysRepository.save,
        ).toBeCalledWith({
          clientGatewayMessageId: 'cgwId',
          payload: 'payload',
          senderDid: 'senderDid',
        });
      });

      it('should call message broker for symmetric keys', () => {
        expect(mockDdhubMessagesService.getSymmetricKeys).toBeCalledTimes(1);
        expect(mockDdhubMessagesService.getSymmetricKeys).toBeCalledWith(
          {
            clientId: 'symmetricKeysClientId',
            amount: 5,
          },
          {
            retries: 1,
          },
        );
      });
    });

    describe('should not update cache as enrolemnt is not created', () => {
      beforeEach(async () => {
        mockIamService.isInitialized = jest
          .fn()
          .mockImplementationOnce(() => true);

        mockIdentityService.identityReady = jest
          .fn()
          .mockImplementationOnce(async () => true);

        mockEnrolmentService.get = jest
          .fn()
          .mockImplementationOnce(async () => null);

        try {
          await service.refreshSymmetricKeysCache();
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should call iam service to check for initialization', () => {
        expect(mockIamService.isInitialized).toBeCalledTimes(1);
      });

      it('should call identity service to confirm identity', () => {
        expect(mockIdentityService.identityReady).toBeCalledTimes(1);
      });

      it('should call enrolment service to check if it was created', () => {
        expect(mockEnrolmentService.get).toBeCalledTimes(1);
      });

      it('should not call further methods', () => {
        expect(mockDdhubMessagesService.getSymmetricKeys).toBeCalledTimes(0);
        expect(
          mockSymmetricKeysRepositoryWrapper.symmetricKeysRepository.save,
        ).toBeCalledTimes(0);
      });
    });

    describe('should not update cache as identity is not ready', () => {
      beforeEach(async () => {
        mockIamService.isInitialized = jest
          .fn()
          .mockImplementationOnce(() => true);

        mockIdentityService.identityReady = jest
          .fn()
          .mockImplementationOnce(async () => false);

        try {
          await service.refreshSymmetricKeysCache();
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should call iam service to check for initialization', () => {
        expect(mockIamService.isInitialized).toBeCalledTimes(1);
      });

      it('should call identity service to confirm identity', () => {
        expect(mockIdentityService.identityReady).toBeCalledTimes(1);
      });

      it('should not call further methods', () => {
        expect(mockEnrolmentService.get).toBeCalledTimes(0);
        expect(mockDdhubMessagesService.getSymmetricKeys).toBeCalledTimes(0);
        expect(
          mockSymmetricKeysRepositoryWrapper.symmetricKeysRepository.save,
        ).toBeCalledTimes(0);
      });
    });

    describe('should not update cache as iam is not initialized', () => {
      beforeEach(async () => {
        mockIamService.isInitialized = jest
          .fn()
          .mockImplementationOnce(() => false);

        try {
          await service.refreshSymmetricKeysCache();
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should call iam service to check for initialization', () => {
        expect(mockIamService.isInitialized).toBeCalledTimes(1);
      });

      it('should not call further methods', () => {
        expect(mockIdentityService.identityReady).toBeCalledTimes(0);
        expect(mockEnrolmentService.get).toBeCalledTimes(0);
        expect(mockDdhubMessagesService.getSymmetricKeys).toBeCalledTimes(0);
        expect(
          mockSymmetricKeysRepositoryWrapper.symmetricKeysRepository.save,
        ).toBeCalledTimes(0);
      });
    });
  });
});
