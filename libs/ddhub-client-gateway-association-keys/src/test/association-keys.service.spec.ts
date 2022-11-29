import {
  AssociationKeysService,
  MnemonicDoesNotExistsException,
} from '@dsb-client-gateway/ddhub-client-gateway-association-keys';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { Bip39Service } from 'libs/ddhub-client-gateway-utils/src/lib/services/bip39.service';
import { AssociationKeysWrapperRepository } from '@dsb-client-gateway/dsb-client-gateway-storage';
import {
  IamNotInitializedException,
  IamService,
} from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { ConfigService } from '@nestjs/config';

const secretsEngineMock = {
  getMnemonic: jest.fn(),
  setMnemonic: jest.fn(),
};

const wrapperMock = {
  repository: {
    get: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  },
};

const iamServiceMock = {
  getDIDAddress: jest.fn(),
  isInitialized: jest.fn(),
};

const configServiceMock = {
  get: jest.fn(),
};

const bip39Service = new Bip39Service();

describe('AssociationKeysService (SPEC)', () => {
  let associationKeysService: AssociationKeysService;

  beforeEach(() => {
    associationKeysService = new AssociationKeysService(
      secretsEngineMock as unknown as SecretsEngineService,
      new Bip39Service(),
      wrapperMock as unknown as AssociationKeysWrapperRepository,
      configServiceMock as unknown as ConfigService,
      iamServiceMock as unknown as IamService
    );
  });

  describe('derivePublicKeys', () => {
    it('should not derive public key as iam is not initialized', async () => {
      iamServiceMock.isInitialized = jest
        .fn()
        .mockImplementationOnce(() => false);

      try {
        await associationKeysService.derivePublicKeys();
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(IamNotInitializedException);
      }
    });

    it('should not derive keys as mnemonic is not set', async () => {
      iamServiceMock.isInitialized = jest
        .fn()
        .mockImplementationOnce(() => true);

      wrapperMock.repository.get = jest
        .fn()
        .mockImplementationOnce(async () => undefined);

      secretsEngineMock.getMnemonic = jest
        .fn()
        .mockImplementationOnce(async () => null);

      try {
        await associationKeysService.derivePublicKeys();
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(MnemonicDoesNotExistsException);
      }
    });

    it('should derive keys', async () => {
      iamServiceMock.isInitialized = jest
        .fn()
        .mockImplementationOnce(() => true);

      wrapperMock.repository.get = jest
        .fn()
        .mockImplementationOnce(async () => undefined);

      secretsEngineMock.getMnemonic = jest
        .fn()
        .mockImplementationOnce(async () => bip39Service.generateMnemonic());

      wrapperMock.repository.save = jest
        .fn()
        .mockImplementation((async) => new Promise((resolve) => resolve(null)));

      configServiceMock.get = jest.fn().mockImplementationOnce(() => 24);

      wrapperMock.repository.findOne = jest
        .fn()
        .mockImplementationOnce(async () => undefined);

      await associationKeysService.derivePublicKeys();

      expect(iamServiceMock.isInitialized).toBeCalledTimes(1);
      expect(secretsEngineMock.getMnemonic).toBeCalledTimes(1);

      expect(wrapperMock.repository.save).toBeCalledTimes(2);
      expect(wrapperMock.repository.findOne).toBeCalledTimes(1);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });
});
