import { Test, TestingModule } from '@nestjs/testing';
import { AssociationKeysService } from './association-keys.service';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import {
  Bip39KeySet,
  Bip39Service,
  RetryConfigService,
} from '@dsb-client-gateway/ddhub-client-gateway-utils';
import {
  AssociationKeyEntity,
  AssociationKeysWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ConfigService } from '@nestjs/config';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import {
  DdhubChannelStreamService,
  DdhubLoginService,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import moment from 'moment';

const mockSecretsEngineService = {
  getMnemonic: jest.fn(),
  setMnemonic: jest.fn(),
};

const mockBip39Service = {
  generateMnemonic: jest.fn(),
  deriveKey: jest.fn(),
};

const mockAssociationKeysWrapperRepository = {
  repository: {
    update: jest.fn(),
    find: jest.fn(),
    getNext: jest.fn(),
    get: jest.fn(),
    save: jest.fn(),
  },
};

const mockConfigService = {
  get: jest.fn(),
};

const mockIamService = {
  isInitialized: jest.fn(),
  getDIDAddress: jest.fn(),
};

const mockDdhubLoginService = {
  initExtChannel: jest.fn(),
};

const mockRetryConfigService = {
  // mockuj metody z RetryConfigService
};

const mockDdhubChannelStreamService = {
  deleteStream: jest.fn(),
};

describe('AssociationKeysService', () => {
  let associationKeysService: AssociationKeysService;
  let error: Error | null = null;
  let result: unknown | null = null;

  beforeEach(async () => {
    jest.resetAllMocks();

    error = null;
    result = null;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssociationKeysService,
        {
          provide: SecretsEngineService,
          useValue: mockSecretsEngineService,
        },
        {
          provide: Bip39Service,
          useValue: mockBip39Service,
        },
        {
          provide: AssociationKeysWrapperRepository,
          useValue: mockAssociationKeysWrapperRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: IamService,
          useValue: mockIamService,
        },
        {
          provide: DdhubLoginService,
          useValue: mockDdhubLoginService,
        },
        {
          provide: RetryConfigService,
          useValue: mockRetryConfigService,
        },
        {
          provide: DdhubChannelStreamService,
          useValue: mockDdhubChannelStreamService,
        },
      ],
    }).compile();

    associationKeysService = module.get<AssociationKeysService>(
      AssociationKeysService,
    );
  });

  it('should be defined', () => {
    expect(associationKeysService).toBeDefined();
  });

  describe('getCurrentKey()', () => {
    describe('should generate both keys', () => {
      const mockDate = moment(
        '2023-10-18 15:30:00',
        'YYYY-MM-DD HH:mm:ss',
      ).toDate();

      beforeEach(async () => {
        mockIamService.isInitialized = jest
          .fn()
          .mockImplementationOnce(() => true);

        mockAssociationKeysWrapperRepository.repository.get = jest
          .fn()
          .mockImplementation(async () => null);

        mockSecretsEngineService.getMnemonic = jest
          .fn()
          .mockImplementationOnce(async () => 'mnemonic');

        mockAssociationKeysWrapperRepository.repository.save = jest
          .fn()
          .mockImplementation(async (entity) => {
            return {
              ...entity,
            };
          });

        mockConfigService.get = jest.fn().mockImplementationOnce(() => {
          return 24;
        });

        mockDdhubLoginService.initExtChannel = jest
          .fn()
          .mockImplementation(async () => {
            return {
              status: [
                {
                  status: 'Success',
                  message: 'Ok',
                },
              ],
            };
          });

        mockIamService.getDIDAddress = jest
          .fn()
          .mockImplementation(() => 'did');

        mockBip39Service.deriveKey = jest.fn().mockImplementation(async () => {
          return {
            privateKey: 'privateKey',
            publicKey: 'publicKey',
            xPrivateKey: 'xPrivateKey',
            xPublicKey: 'xPublicKey',
          } as Bip39KeySet;
        });

        try {
          result = await associationKeysService.derivePublicKeys(mockDate);
        } catch (e) {
          error = e;
        }
      });

      it('should check if iam is initialized', () => {
        expect(mockIamService.isInitialized).toBeCalledTimes(1);
      });

      it('should save both keys', () => {
        expect(
          mockAssociationKeysWrapperRepository.repository.save,
        ).toBeCalledTimes(4);

        expect(
          mockAssociationKeysWrapperRepository.repository.save,
        ).toHaveBeenNthCalledWith(1, {
          associationKey: 'publicKey',
          isSent: false,
          owner: 'did',
          sentDate: null,
          validFrom: mockDate,
          validTo: moment(mockDate).add(24, 'hours').toDate(),
          isShared: false,
          sharedDate: null,
          iteration: '20231018_153000',
        });

        expect(
          mockAssociationKeysWrapperRepository.repository.save,
        ).toHaveBeenNthCalledWith(2, {
          associationKey: 'publicKey',
          isSent: true,
          owner: 'did',
          sentDate: expect.any(Date),
          validFrom: mockDate,
          validTo: moment(mockDate).add(24, 'hours').toDate(),
          isShared: false,
          sharedDate: null,
          iteration: '20231018_153000',
        });

        expect(
          mockAssociationKeysWrapperRepository.repository.save,
        ).toHaveBeenNthCalledWith(3, {
          associationKey: 'publicKey',
          isSent: false,
          owner: 'did',
          sentDate: null,
          validFrom: moment(mockDate).add(24, 'hours').toDate(),
          validTo: moment(mockDate).add(48, 'hours').toDate(),
          isShared: false,
          sharedDate: null,
          iteration: '20231020_153000',
        });

        expect(
          mockAssociationKeysWrapperRepository.repository.save,
        ).toHaveBeenNthCalledWith(4, {
          associationKey: 'publicKey',
          isSent: true,
          owner: 'did',
          sentDate: expect.any(Date),
          validFrom: moment(mockDate).add(24, 'hours').toDate(),
          validTo: moment(mockDate).add(48, 'hours').toDate(),
          isShared: false,
          sharedDate: null,
          iteration: '20231020_153000',
        });
      });

      it('should try to fetch current/next keys', () => {
        expect(
          mockAssociationKeysWrapperRepository.repository.get,
        ).toBeCalledTimes(2);

        expect(
          mockAssociationKeysWrapperRepository.repository.get,
        ).toHaveBeenNthCalledWith(1, mockDate);

        expect(
          mockAssociationKeysWrapperRepository.repository.get,
        ).toHaveBeenNthCalledWith(
          2,
          moment(mockDate).add(48, 'hours').toDate(),
        );
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });
    });
  });

  describe('getForDate()', () => {
    describe('should return result', () => {
      const date = new Date();

      beforeEach(async () => {
        try {
          result = await associationKeysService.getForDate(date);
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should call repository', () => {
        expect(
          mockAssociationKeysWrapperRepository.repository.getNext,
        ).toBeCalledTimes(1);

        expect(
          mockAssociationKeysWrapperRepository.repository.getNext,
        ).toBeCalledWith(date);
      });
    });
  });

  describe('getCurrentAndNext()', () => {
    describe('should use existing key from repository', () => {
      const mockResult: AssociationKeyEntity = {
        associationKey: 'key',
        isSent: false,
        owner: 'owner',
        createdDate: new Date(),
        sentDate: new Date(),
        isShared: false,
        sharedDate: new Date(),
        iteration: '1',
        updatedDate: new Date(),
        validTo: moment().add(1, 'day').toDate(),
        validFrom: new Date(),
      };

      const mockNextKey: AssociationKeyEntity = {
        associationKey: 'key2',
        isSent: false,
        owner: 'owner',
        createdDate: new Date(),
        sentDate: new Date(),
        isShared: false,
        sharedDate: new Date(),
        iteration: '1',
        updatedDate: new Date(),
        validTo: moment().add(1, 'day').toDate(),
        validFrom: new Date(),
      };

      beforeEach(async () => {
        mockAssociationKeysWrapperRepository.repository.get = jest
          .fn()
          .mockImplementationOnce(async () => mockResult);

        mockAssociationKeysWrapperRepository.repository.getNext = jest
          .fn()
          .mockImplementationOnce(async () => mockNextKey);

        try {
          result = await associationKeysService.getCurrentAndNext();
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
      });

      it('result should contain both keys', () => {
        const casted = result as {
          current: AssociationKeyEntity;
          next: AssociationKeyEntity;
        };

        expect(casted.current).toStrictEqual(mockResult);
        expect(casted.next).toStrictEqual(mockNextKey);
      });

      it('should call get current key', () => {
        expect(
          mockAssociationKeysWrapperRepository.repository.get,
        ).toBeCalledTimes(1);
        expect(
          mockAssociationKeysWrapperRepository.repository.get,
        ).toBeCalledWith(expect.any(Date));
      });

      it('should call for next key', () => {
        expect(
          mockAssociationKeysWrapperRepository.repository.getNext,
        ).toBeCalledTimes(1);
        expect(
          mockAssociationKeysWrapperRepository.repository.getNext,
        ).toBeCalledWith(mockResult.validTo);
      });
    });
  });

  describe('getNonSharedKeys()', () => {
    describe('should return non shared keys', () => {
      const mockResult: AssociationKeyEntity[] = [
        {
          associationKey: 'key',
          isSent: false,
          owner: 'owner',
          createdDate: new Date(),
          sentDate: new Date(),
          isShared: false,
          sharedDate: new Date(),
          iteration: '1',
          updatedDate: new Date(),
          validTo: new Date(),
          validFrom: new Date(),
        },
      ];

      beforeEach(async () => {
        try {
          mockAssociationKeysWrapperRepository.repository.find = jest
            .fn()
            .mockImplementationOnce(async () => mockResult);

          result = await associationKeysService.getNotSharedKeys();
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
      });

      it('result should contain mocked data from repository', () => {
        expect(result).toStrictEqual(mockResult);
      });

      it('should call repository to find not shared keys', () => {
        expect(
          mockAssociationKeysWrapperRepository.repository.find,
        ).toBeCalledTimes(1);
        expect(
          mockAssociationKeysWrapperRepository.repository.find,
        ).toBeCalledWith({
          where: {
            isShared: false,
          },
        });
      });
    });
  });

  describe('updateKeySharedState()', () => {
    describe('should update in database', () => {
      beforeEach(async () => {
        try {
          await associationKeysService.updateKeySharedState(['key1', 'key2']);
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should call repository', () => {
        expect(
          mockAssociationKeysWrapperRepository.repository.update,
        ).toBeCalledTimes(1);
      });
    });
  });
});
