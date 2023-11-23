import { Test, TestingModule } from '@nestjs/testing';
import { IdentityService } from './identity.service';
import { EthersService } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import {
  BalanceState,
  IdentityEntity,
  IdentityRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import {
  NoPrivateKeyException,
  SecretsEngineService,
} from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { EnrolmentService } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';
import { CommandBus } from '@nestjs/cqrs';
import { CleanupCommand } from '@dsb-client-gateway/ddhub-client-gateway-cleanup';
import { ReloginCommand } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { TriggerEventCommand } from '../../../../ddhub-client-gateway-events/src/lib/command/trigger-event.command';
import { Events } from '@dsb-client-gateway/ddhub-client-gateway-events';
import { RefreshKeysCommand } from '@dsb-client-gateway/ddhub-client-gateway-encryption';
import { RoleStatus } from '@ddhub-client-gateway/identity/models';

const ethersServiceMock: Partial<EthersService> = {
  getWalletFromPrivateKey: jest.fn(),
  createPrivateKey: jest.fn(),
  getBalance: jest.fn(),
};

const identityRepositoryWrapperMock = {
  identityRepository: {
    findOne: jest.fn(),
    createOne: jest.fn(),
    clear: jest.fn(),
  },
};

const secretsEngineServiceMock: Partial<SecretsEngineService> = {
  getPrivateKey: jest.fn(),
  setPrivateKey: jest.fn(),
};

const iamServiceMock: Partial<IamService> = {
  getDIDAddress: jest.fn(),
  isInitialized: jest.fn(),
  getClaimsWithStatus: jest.fn(),
  setup: jest.fn(),
};

const enrolmentServiceMock: Partial<EnrolmentService> = {
  get: jest.fn(),
  deleteEnrolment: jest.fn(),
  generateEnrolment: jest.fn(),
};

const commandBusMock: Partial<CommandBus> = {
  execute: jest.fn(),
};

describe('IdentityService', () => {
  let service: IdentityService;
  let error: Error | null = null;
  let result: unknown | null = null;

  beforeEach(async () => {
    jest.clearAllMocks();
    error = null;
    result = null;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IdentityService,
        {
          provide: EthersService,
          useValue: ethersServiceMock,
        },
        {
          provide: IdentityRepositoryWrapper,
          useValue: identityRepositoryWrapperMock,
        },
        {
          provide: SecretsEngineService,
          useValue: secretsEngineServiceMock,
        },
        {
          provide: IamService,
          useValue: iamServiceMock,
        },
        {
          provide: EnrolmentService,
          useValue: enrolmentServiceMock,
        },
        {
          provide: CommandBus,
          useValue: commandBusMock,
        },
      ],
    }).compile();

    service = module.get<IdentityService>(IdentityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getClaims()', () => {
    describe('should return claims', () => {
      beforeEach(async () => {
        iamServiceMock.getDIDAddress = jest
          .fn()
          .mockImplementationOnce(() => 'did');

        iamServiceMock.getClaimsWithStatus = jest
          .fn()
          .mockImplementationOnce(async () => [
            {
              namespace: 'namespace',
              status: RoleStatus.SYNCED,
              syncedToDidDoc: true,
            },
          ]);

        try {
          result = await service.getClaims();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
      });

      it('result should contain returned claims', () => {
        expect(result).toStrictEqual({
          did: 'did',
          claims: [
            {
              namespace: 'namespace',
              status: RoleStatus.SYNCED,
              syncedToDidDoc: true,
            },
          ],
        });
      });

      it('should call iam service to get did address', () => {
        expect(iamServiceMock.getDIDAddress).toBeCalledTimes(1);
        expect(iamServiceMock.getClaimsWithStatus).toBeCalledTimes(1);
      });
    });
  });

  describe('createIdentity()', () => {
    describe('should create identity', () => {
      beforeEach(async () => {
        secretsEngineServiceMock.getPrivateKey = jest
          .fn()
          .mockImplementationOnce(async () => null);

        ethersServiceMock.getBalance = jest
          .fn()
          .mockImplementationOnce(async () => BalanceState.OK);

        ethersServiceMock.getWalletFromPrivateKey = jest
          .fn()
          .mockImplementationOnce(() => {
            return {
              publicKey: 'some-public-key',
              address: 'some-address',
            };
          });

        try {
          await service.createIdentity('private-key');
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
      });

      it('should call secrets engine to obtain old private key', () => {
        expect(secretsEngineServiceMock.getPrivateKey).toBeCalledTimes(1);
      });

      it('should create wallet from pk', () => {
        expect(ethersServiceMock.getWalletFromPrivateKey).toBeCalledTimes(1);
        expect(ethersServiceMock.getWalletFromPrivateKey).toBeCalledWith(
          'private-key'
        );
      });

      it('should obtain wallet balance', () => {
        expect(ethersServiceMock.getBalance).toBeCalledTimes(1);

        expect(ethersServiceMock.getBalance).toBeCalledWith('some-address');
      });

      it('should create identity in database', () => {
        expect(
          identityRepositoryWrapperMock.identityRepository.createOne
        ).toBeCalledTimes(1);

        expect(
          identityRepositoryWrapperMock.identityRepository.createOne
        ).toBeCalledWith({
          publicKey: 'some-public-key',
          address: 'some-address',
          balance: BalanceState.OK,
        });
      });

      it('should set new private key in secrets engine', () => {
        expect(secretsEngineServiceMock.setPrivateKey).toBeCalledTimes(1);

        expect(secretsEngineServiceMock.setPrivateKey).toBeCalledWith(
          'private-key'
        );
      });

      it('should setup iam', () => {
        expect(iamServiceMock.setup).toBeCalledTimes(1);
        expect(iamServiceMock.setup).toBeCalledWith('private-key');
      });

      it('should create new enrolment', () => {
        expect(enrolmentServiceMock.deleteEnrolment).toBeCalledTimes(1);
        expect(enrolmentServiceMock.generateEnrolment).toBeCalledTimes(1);
      });

      it('should execute command bus', () => {
        expect(commandBusMock.execute).toBeCalledTimes(4);

        expect(commandBusMock.execute).toHaveBeenNthCalledWith(
          1,
          new CleanupCommand()
        );
        expect(commandBusMock.execute).toHaveBeenNthCalledWith(
          2,
          new ReloginCommand('IDENTITY_CHANGE')
        );

        expect(commandBusMock.execute).toHaveBeenNthCalledWith(
          3,
          new RefreshKeysCommand()
        );

        expect(commandBusMock.execute).toHaveBeenNthCalledWith(
          4,
          new TriggerEventCommand(Events.PRIVATE_KEY_CHANGED)
        );
      });
    });
  });

  describe('removeIdentity()', () => {
    describe('should call mock repository clear', () => {
      beforeEach(async () => {
        try {
          await service.removeIdentity();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
        expect(result).toBeNull();
      });

      it('should execute without error', () => {
        expect(
          identityRepositoryWrapperMock.identityRepository.clear
        ).toBeCalledTimes(1);
      });
    });
  });

  describe('getIdentity()', () => {
    describe('should fail as private key does not exists', () => {
      beforeEach(async () => {
        identityRepositoryWrapperMock.identityRepository.findOne = jest
          .fn()
          .mockImplementationOnce(async () => null);

        secretsEngineServiceMock.getPrivateKey = jest
          .fn()
          .mockImplementationOnce(async () => null);

        try {
          result = await service.getIdentity();
        } catch (e) {
          error = e;
        }
      });

      it('should execute with error', () => {
        expect(error).toBeInstanceOf(NoPrivateKeyException);
        expect(result).toBeNull();
      });

      it('should call secrets engine service', () => {
        expect(secretsEngineServiceMock.getPrivateKey).toBeCalledTimes(1);
      });

      it('should call repository', () => {
        expect(
          identityRepositoryWrapperMock.identityRepository.findOne
        ).toBeCalledTimes(1);
      });

      it('should not try to create new identity', () => {
        expect(ethersServiceMock.getWalletFromPrivateKey).toBeCalledTimes(0);
        expect(ethersServiceMock.getBalance).toBeCalledTimes(0);
      });
    });

    describe('should force refresh identity', () => {
      beforeEach(async () => {
        identityRepositoryWrapperMock.identityRepository.findOne = jest
          .fn()
          .mockImplementationOnce(async () => {
            return null;
          });

        secretsEngineServiceMock.getPrivateKey = jest
          .fn()
          .mockImplementationOnce(async () => {
            return 'private-key';
          });

        ethersServiceMock.getWalletFromPrivateKey = jest
          .fn()
          .mockImplementationOnce(() => {
            return {
              publicKey: 'some-public-key',
              address: 'some-address',
            };
          });

        ethersServiceMock.getBalance = jest
          .fn()
          .mockImplementationOnce(async () => {
            return BalanceState.OK;
          });

        try {
          result = await service.getIdentity();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
        expect(result).not.toBeNull();
      });

      it('should call repository', () => {
        expect(
          identityRepositoryWrapperMock.identityRepository.findOne
        ).toBeCalledTimes(1);
      });

      it('should call secrets engine', () => {
        expect(secretsEngineServiceMock.getPrivateKey).toBeCalledTimes(1);
      });

      it('should create wallet instance', () => {
        expect(ethersServiceMock.getWalletFromPrivateKey).toBeCalledTimes(1);

        expect(ethersServiceMock.getWalletFromPrivateKey).toBeCalledWith(
          'private-key'
        );
      });

      it('should obtain balance', () => {
        expect(ethersServiceMock.getBalance).toBeCalledTimes(1);

        expect(ethersServiceMock.getBalance).toBeCalledWith('some-address');
      });

      it('result should contain returned identity', () => {
        expect(result).toStrictEqual({
          publicKey: 'some-public-key',
          balance: BalanceState.OK,
          address: 'some-address',
        });
      });
    });

    describe('should return identity from repository', () => {
      beforeEach(async () => {
        identityRepositoryWrapperMock.identityRepository.findOne = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              publicKey: 'publicKey',
              address: 'address',
              balance: BalanceState.OK,
            } as IdentityEntity;
          });

        try {
          result = await service.getIdentity();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
        expect(result).not.toBeNull();
      });

      it('should call repository', () => {
        expect(
          identityRepositoryWrapperMock.identityRepository.findOne
        ).toBeCalledTimes(1);
      });

      it('should not try to create new identity', () => {
        expect(secretsEngineServiceMock.getPrivateKey).toBeCalledTimes(0);
        expect(ethersServiceMock.getWalletFromPrivateKey).toBeCalledTimes(0);
        expect(ethersServiceMock.getBalance).toBeCalledTimes(0);
      });
    });
  });
});
