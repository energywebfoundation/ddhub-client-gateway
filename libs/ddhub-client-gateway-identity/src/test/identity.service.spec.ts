import { IdentityService } from '@dsb-client-gateway/ddhub-client-gateway-identity';
import { Claim } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import {
  BalanceState,
  RoleStatus,
} from '@ddhub-client-gateway/identity/models';
import { NoPrivateKeyException } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { Wallet } from 'ethers';

const ethersServiceMock = {
  getWalletFromPrivateKey: jest.fn(),
  getBalance: jest.fn(),
};

const secretsEngineMock = {
  getPrivateKey: jest.fn(),
  setPrivateKey: jest.fn(),
};

const iamServiceMock = {
  getDIDAddress: jest.fn(),
  getClaimsWithStatus: jest.fn(),
  setup: jest.fn(),
};

const commandBusMock = {
  execute: jest.fn(),
};

const enrolmentServiceMock = {
  get: jest.fn(),
  deleteEnrolment: jest.fn(),
  generateEnrolment: jest.fn(),
};

const identityRepositoryWrapperMock = {
  identityRepository: {
    clear: jest.fn(),
    findOne: jest.fn(),
    createOne: jest.fn(),
  },
};

describe('IdentityService (SPEC)', () => {
  let identityService: IdentityService;

  beforeEach(() => {
    identityService = new IdentityService(
      ethersServiceMock as any,
      identityRepositoryWrapperMock as any,
      secretsEngineMock as any,
      iamServiceMock as any,
      enrolmentServiceMock as any,
      commandBusMock as any
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('removeIdentity', () => {
    it('should call mock repository clear', async () => {
      await identityService.removeIdentity();

      expect(
        identityRepositoryWrapperMock.identityRepository.clear
      ).toBeCalledTimes(1);
    });
  });

  describe('getClaims', () => {
    it('should return claims with did address', async () => {
      const didAddress = 'did:ethr:volta:DID';

      const claimsToReturn: Claim[] = [
        {
          namespace: 'test.namespace',
          status: RoleStatus.SYNCED,
          syncedToDidDoc: true,
        },
      ];

      iamServiceMock.getClaimsWithStatus = jest
        .fn()
        .mockImplementationOnce(async () => claimsToReturn);

      iamServiceMock.getDIDAddress = jest
        .fn()
        .mockImplementationOnce(() => didAddress);

      const { did, claims } = await identityService.getClaims();

      expect(claims).toEqual(claimsToReturn);
      expect(did).toEqual(didAddress);
    });
  });

  describe('createIdentity', () => {
    it('should create identity without deriving keys', async () => {
      const randomWallet = Wallet.createRandom();

      ethersServiceMock.getBalance = jest
        .fn()
        .mockImplementationOnce(async () => BalanceState.NONE);

      ethersServiceMock.getWalletFromPrivateKey = jest
        .fn()
        .mockImplementationOnce(() => randomWallet);

      await identityService.createIdentity(randomWallet.privateKey);

      expect(ethersServiceMock.getWalletFromPrivateKey).toBeCalledTimes(1);
      expect(ethersServiceMock.getWalletFromPrivateKey).toBeCalledWith(
        randomWallet.privateKey
      );

      expect(ethersServiceMock.getBalance).toBeCalledTimes(1);
      expect(ethersServiceMock.getBalance).toBeCalledWith(randomWallet.address);

      expect(
        identityRepositoryWrapperMock.identityRepository.createOne
      ).toBeCalledTimes(1);
      expect(
        identityRepositoryWrapperMock.identityRepository.createOne
      ).toBeCalledWith({
        publicKey: randomWallet.publicKey,
        balance: BalanceState.NONE,
        address: randomWallet.address,
      });

      expect(secretsEngineMock.setPrivateKey).toBeCalledTimes(1);
      expect(secretsEngineMock.setPrivateKey).toBeCalledWith(
        randomWallet.privateKey
      );

      expect(iamServiceMock.setup).toBeCalledTimes(1);
      expect(iamServiceMock.setup).toBeCalledWith(randomWallet.privateKey);

      expect(enrolmentServiceMock.deleteEnrolment).toBeCalledTimes(1);
      expect(enrolmentServiceMock.generateEnrolment).toBeCalledTimes(1);

      expect(commandBusMock.execute).toBeCalledTimes(0);
    });
  });

  describe('identityReady', () => {
    it('identity should not be ready', async () => {
      secretsEngineMock.getPrivateKey = jest
        .fn()
        .mockImplementationOnce(async () => null);
      identityRepositoryWrapperMock.identityRepository.findOne = jest
        .fn()
        .mockImplementationOnce(async () => null);

      try {
        await identityService.identityReady();

        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(NoPrivateKeyException);
      }
    });

    it('should force refresh', async () => {
      secretsEngineMock.getPrivateKey = jest
        .fn()
        .mockImplementationOnce(async () => 'privateKey');

      identityRepositoryWrapperMock.identityRepository.findOne = jest
        .fn()
        .mockImplementationOnce(async () => null);

      ethersServiceMock.getBalance = jest
        .fn()
        .mockImplementationOnce(async () => BalanceState.NONE);

      ethersServiceMock.getWalletFromPrivateKey = jest
        .fn()
        .mockImplementationOnce(() => Wallet.createRandom());

      const ready: boolean = await identityService.identityReady();

      expect(ready).toBe(true);

      expect(secretsEngineMock.getPrivateKey).toBeCalledTimes(1);
      expect(ethersServiceMock.getWalletFromPrivateKey).toBeCalledTimes(1);
    });
  });
});
