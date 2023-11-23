import { KeysService } from './keys.service';
import { Test } from '@nestjs/testing';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { EthersService } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import {
  IamInitService,
  IdentityService,
} from '@dsb-client-gateway/ddhub-client-gateway-identity';
import {
  BalanceState,
  DidEntity,
  DidWrapperRepository,
  IdentityEntity,
  SymmetricKeysRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { SymmetricKeysCacheService } from '@dsb-client-gateway/ddhub-client-gateway-encryption';
import { ConfigService } from '@nestjs/config';
import { KeysEntity } from '../keys.interface';
import { Readable } from 'stream';
import * as fs from 'fs';
import mockfs from 'mock-fs';
import { EncryptedMessageType } from '../../message/message.const';
import { Wallet } from 'ethers/lib/ethers';
import { DIDPublicKeyTags } from '../keys.const';
import moment from 'moment';

const secretsEngineServiceMock = {
  getRSAPrivateKey: jest.fn(),
  getPrivateKey: jest.fn(),
  setRSAPrivateKey: jest.fn(),
};

const iamServiceMock = {
  getDid: jest.fn(),
  getDIDAddress: jest.fn(),
  setVerificationMethod: jest.fn(),
};

const ethersServiceMock = {
  getWalletFromPrivateKey: jest.fn(),
};

const identityServiceMock = {
  getIdentity: jest.fn(),
};

const symmetricKeysCacheServiceyMock = {
  refreshSymmetricKeysCache: jest.fn(),
};

const symetricKeysRepositoryWrapperMock = {
  symmetricKeysRepository: {
    findOne: jest.fn(),
  },
};

const iamInitServiceMock = {
  onModuleInit: jest.fn(),
};

const didWrapperServiceMock = {
  didRepository: {
    findOne: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
  },
};

const configServiceMock = {
  get: jest.fn(),
};

describe(`${KeysService.name}`, () => {
  let service: KeysService;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    const app = await Test.createTestingModule({
      providers: [
        KeysService,
        {
          provide: IamInitService,
          useValue: iamInitServiceMock,
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
          provide: EthersService,
          useValue: ethersServiceMock,
        },
        {
          provide: IdentityService,
          useValue: identityServiceMock,
        },
        {
          provide: SymmetricKeysRepositoryWrapper,
          useValue: symetricKeysRepositoryWrapperMock,
        },
        {
          provide: SymmetricKeysCacheService,
          useValue: symmetricKeysCacheServiceyMock,
        },
        {
          provide: DidWrapperRepository,
          useValue: didWrapperServiceMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = app.get<KeysService>(KeysService);
  });

  describe('generateKeys()', () => {
    let error: Error | null;
    let result: unknown;

    describe('should generate keys', () => {
      const wallet = Wallet.createRandom();
      const did = 'did:ethr:volta:' + wallet.publicKey;

      beforeEach(async () => {
        error = null;
        result = null;

        secretsEngineServiceMock.getPrivateKey = jest
          .fn()
          .mockImplementation(async () => {
            return wallet.privateKey;
          });

        iamServiceMock.getDIDAddress = jest.fn().mockImplementation(() => did);

        iamServiceMock.getDid = jest.fn().mockImplementation(async () => {
          return {
            publicKey: [],
          };
        });

        identityServiceMock.getIdentity = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              publicKey: wallet.publicKey,
              address: did,
              balance: BalanceState.LOW,
            } as IdentityEntity;
          });

        ethersServiceMock.getWalletFromPrivateKey = jest
          .fn()
          .mockImplementationOnce(() => wallet);

        try {
          result = await service.generateKeys();
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).not.toBeDefined();
      });

      it('should update verification method for signature', () => {
        expect(iamServiceMock.setVerificationMethod).toBeCalledTimes(2);

        expect(iamServiceMock.setVerificationMethod).toHaveBeenNthCalledWith(
          1,
          wallet.publicKey,
          DIDPublicKeyTags.DSB_SIGNATURE_KEY
        );
      });

      it('should call secrets engine service to obtain private key', () => {
        expect(secretsEngineServiceMock.getPrivateKey).toBeCalledTimes(2);
      });

      it('should store new generated private rsa key', () => {
        expect(secretsEngineServiceMock.setRSAPrivateKey).toBeCalledTimes(1);
      });

      it('should call identity service to check for identity', () => {
        expect(identityServiceMock.getIdentity).toBeCalledTimes(1);
      });

      it('should call ethers to obtain wallet object from private key', () => {
        expect(ethersServiceMock.getWalletFromPrivateKey).toBeCalledTimes(1);
        expect(ethersServiceMock.getWalletFromPrivateKey).toBeCalledWith(
          wallet.privateKey
        );
      });

      it('should init iam', () => {
        expect(iamInitServiceMock.onModuleInit).toBeCalledTimes(1);
      });

      it('should obtain did', () => {
        expect(iamServiceMock.getDid).toBeCalledTimes(1);
      });
    });

    describe('should not generate keys as balance is empty', () => {
      beforeEach(async () => {
        error = null;
        result = null;

        secretsEngineServiceMock.getPrivateKey = jest
          .fn()
          .mockImplementationOnce(async () => {
            return 'something';
          });

        identityServiceMock.getIdentity = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              publicKey: 'publicKey',
              address: 'address',
              balance: BalanceState.NONE,
            } as IdentityEntity;
          });

        try {
          result = await service.generateKeys();
        } catch (e) {
          error = e;
        }
      });

      it('should not execute', () => {
        expect(error).toBeNull();
        expect(result).not.toBeDefined();
      });

      it('should call secrets engine service to obtain private key', () => {
        expect(secretsEngineServiceMock.getPrivateKey).toBeCalledTimes(1);
      });

      it('should call identity service to check for identity', () => {
        expect(identityServiceMock.getIdentity).toBeCalledTimes(1);
      });

      it('should not call further methods', () => {
        expect(ethersServiceMock.getWalletFromPrivateKey).toBeCalledTimes(0);
        expect(iamInitServiceMock.onModuleInit).toBeCalledTimes(0);
        expect(iamServiceMock.getDid).toBeCalledTimes(0);
        expect(iamServiceMock.setVerificationMethod).toBeCalledTimes(0);
      });
    });

    describe('should not generate keys as identity is missing', () => {
      beforeEach(async () => {
        error = null;
        result = null;

        secretsEngineServiceMock.getPrivateKey = jest
          .fn()
          .mockImplementationOnce(async () => {
            return 'something';
          });

        identityServiceMock.getIdentity = jest
          .fn()
          .mockImplementationOnce(async () => null);

        try {
          result = await service.generateKeys();
        } catch (e) {
          error = e;
        }
      });

      it('should not execute', () => {
        expect(error).toBeNull();
        expect(result).not.toBeDefined();
      });

      it('should call secrets engine service to obtain private key', () => {
        expect(secretsEngineServiceMock.getPrivateKey).toBeCalledTimes(1);
      });

      it('should call identity service to check for identity', () => {
        expect(identityServiceMock.getIdentity).toBeCalledTimes(1);
      });

      it('should not call further methods', () => {
        expect(ethersServiceMock.getWalletFromPrivateKey).toBeCalledTimes(0);
        expect(iamInitServiceMock.onModuleInit).toBeCalledTimes(0);
        expect(iamServiceMock.getDid).toBeCalledTimes(0);
        expect(iamServiceMock.setVerificationMethod).toBeCalledTimes(0);
      });
    });

    describe('should not generate keys as root key is missing', () => {
      beforeEach(async () => {
        error = null;
        result = null;

        secretsEngineServiceMock.getPrivateKey = jest
          .fn()
          .mockImplementationOnce(async () => {
            return null;
          });

        try {
          result = await service.generateKeys();
        } catch (e) {
          error = e;
        }
      });

      it('should not execute', () => {
        expect(error).toBeNull();
        expect(result).not.toBeDefined();
      });

      it('should call secrets engine service to obtain private key', () => {
        expect(secretsEngineServiceMock.getPrivateKey).toBeCalledTimes(1);
      });

      it('should not call further methods', () => {
        expect(identityServiceMock.getIdentity).toBeCalledTimes(0);
        expect(ethersServiceMock.getWalletFromPrivateKey).toBeCalledTimes(0);
        expect(iamInitServiceMock.onModuleInit).toBeCalledTimes(0);
        expect(iamServiceMock.getDid).toBeCalledTimes(0);
        expect(iamServiceMock.setVerificationMethod).toBeCalledTimes(0);
      });
    });
  });

  describe('decryptSymmetricKey()', () => {
    let error: Error | null;
    let result: unknown;

    describe('should decrypt symmetric key', () => {
      const symmetricKey = 'test-key';

      beforeEach(async () => {
        error = null;
        result = null;

        const wallet = Wallet.createRandom();

        const rsaKey = service.deriveRSAKey(wallet.privateKey);

        didWrapperServiceMock.didRepository.findOne = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              did: 'did',
              createdDate: new Date(),
              updatedDate: moment().add(1, 'day').toDate(),
              publicRSAKey: rsaKey.publicKey,
              publicSignatureKey: 'signature-key',
            } as DidEntity;
          });

        const encryptedSymmetricKey = await service.encryptSymmetricKey(
          symmetricKey,
          'did'
        );

        try {
          result = service.decryptSymmetricKey(
            rsaKey.privateKey,
            encryptedSymmetricKey,
            wallet.privateKey
          );
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
      });

      it('result should equal to symmetric key', () => {
        expect(result).toBe(symmetricKey);
      });
    });
  });

  describe('encryptSymmetricKey()', () => {
    let error: Error | null;
    let result: unknown;

    describe('should not encrypt symmetric key due to missing did', () => {
      beforeEach(async () => {
        result = null;
        error = null;

        didWrapperServiceMock.didRepository.findOne = jest
          .fn()
          .mockImplementationOnce(async () => null);

        iamServiceMock.getDid = jest
          .fn()
          .mockImplementationOnce(async () => null);

        try {
          result = await service.encryptSymmetricKey('symmetric-key', 'did');
        } catch (e) {
          error = e;
        }
      });

      it('should not execute', () => {
        expect(error).toBeNull();
        expect(result).toBe(undefined);
      });

      it('should call iam service to refresh cache', () => {
        expect(iamServiceMock.getDid).toBeCalledTimes(1);
        expect(iamServiceMock.getDid).toBeCalledWith('did');
      });

      it('should call repository', () => {
        expect(didWrapperServiceMock.didRepository.findOne).toBeCalledTimes(1);
        expect(didWrapperServiceMock.didRepository.findOne).toBeCalledWith({
          where: {
            did: 'did',
          },
        });
      });
    });

    // describe('should encrypt symmetric key', () => {
    //   beforeEach(async () => {
    //     didWrapperServiceMock.didRepository.findOne = jest
    //       .fn()
    //       .mockImplementationOnce(async () => {
    //         return {
    //           did: 'did',
    //           createdDate: new Date(),
    //           updatedDate: new Date(),
    //           publicRSAKey: 'a',
    //           publicSignatureKey: 'a',
    //         } as DidEntity;
    //       });
    //
    //     try {
    //       result = await service.encryptSymmetricKey('symmetric-key', 'did');
    //     } catch (e) {
    //       error = e;
    //     }
    //   });
    //
    //   it('should execute', () => {
    //     expect(result).toBeDefined();
    //   });
    // });
  });

  describe('verifySignature()', () => {
    let error: Error | null;
    let result: unknown;

    describe('should not verify signature', () => {
      beforeEach(async () => {
        error = null;
        result = null;

        const payload = 'abcdf';
        const sharedKey = service.generateRandomKey();

        const encryptedMessage = service.encryptMessage(
          payload,
          sharedKey,
          'utf-8'
        );

        const wallet = Wallet.createRandom();

        const invalidWallet = Wallet.createRandom();

        const signature = service.createSignature(
          encryptedMessage,
          wallet.privateKey
        );

        try {
          result = await service.verifySignature(
            'did',
            signature,
            encryptedMessage,
            {
              publicSignatureKey: invalidWallet.publicKey,
              did: 'did',
              createdDate: new Date(),
              publicRSAKey: 'rsa-key',
              updatedDate: new Date(),
            }
          );
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should verify signature', () => {
        expect(result).toBeFalsy();
      });
    });

    describe('should verify signature', () => {
      let error: Error | null;
      let result: unknown;

      beforeEach(async () => {
        error = null;
        result = null;

        const payload = 'abcdf';
        const sharedKey = service.generateRandomKey();

        const encryptedMessage = service.encryptMessage(
          payload,
          sharedKey,
          'utf-8'
        );

        const wallet = Wallet.createRandom();

        const signature = service.createSignature(
          encryptedMessage,
          wallet.privateKey
        );

        try {
          result = await service.verifySignature(
            'did',
            signature,
            encryptedMessage,
            {
              publicSignatureKey: wallet.publicKey,
              did: 'did',
              createdDate: new Date(),
              publicRSAKey: 'rsa-key',
              updatedDate: new Date(),
            }
          );
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should verify signature', () => {
        expect(result).toBeTruthy();
      });
    });
  });

  describe('createSignature()', () => {
    let error: Error | null;
    let result: unknown;

    describe('should create signature', () => {
      beforeEach(async () => {
        result = null;
        error = null;

        const wallet = Wallet.createRandom();

        try {
          result = service.createSignature('encryptedData', wallet.privateKey);
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(result).toBeDefined();
        expect(error).toBeNull();
      });
    });
  });

  describe('encryptMessage()', () => {
    let error: Error | null;
    let result: unknown;

    describe('should encrypt message', () => {
      beforeEach(async () => {
        error = null;
        result = null;

        mockfs({
          path: {},
        });

        const computedSharedKey = service.generateRandomKey();

        configServiceMock.get = jest.fn().mockImplementationOnce(() => 'path');

        try {
          result = service.encryptMessage(
            'asdfghj',
            computedSharedKey,
            EncryptedMessageType['UTF-8']
          );
        } catch (e) {
          error = e;
        }
      });

      it('content should be encrypted', () => {
        expect(result).not.toBe('asdfghj');
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });
    });
  });

  describe('encryptMessageStream()', () => {
    afterAll(() => {
      mockfs.restore();
    });

    describe('should encrypt file', () => {
      let error: Error | null;
      let result: unknown;

      beforeEach(async () => {
        error = null;
        result = null;

        mockfs({
          path: {},
        });

        const computedSharedKey = service.generateRandomKey();

        configServiceMock.get = jest.fn().mockImplementationOnce(() => 'path');

        try {
          const buffer = Buffer.from('asdfghj', 'base64');
          const readable = Readable.from(buffer);

          result = await service.encryptMessageStream(
            readable,
            computedSharedKey,
            'test'
          );
        } catch (e) {
          error = e;
        }
      });

      it('file should be encrypted', () => {
        const content = fs.readFileSync('path/test.enc');

        expect(content.byteLength).toBe(32);

        const stringifiedContent = content.toString();

        expect(stringifiedContent).not.toBe('asdfghj');
      });

      it('should return path to written directory', () => {
        expect(result).toBe('path/test.enc');
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });
    });
  });

  describe('generateRandomKey()', () => {
    describe('should generate random key', () => {
      let error: Error | null;
      let result: unknown;

      beforeEach(() => {
        try {
          error = null;
          result = null;

          result = service.generateRandomKey();
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
      });
    });
  });

  describe('getSymmetricKey()', () => {
    describe('should fetch symmetric key from message broker', () => {
      let error: Error | null;
      let result: unknown;

      const cachedSymmetricKey = {
        clientGatewayMessageId: 'cgwid',
        payload: 'payload',
        senderDid: 'senderdid',
      } as KeysEntity;

      beforeEach(async () => {
        error = null;
        result = null;

        try {
          symetricKeysRepositoryWrapperMock.symmetricKeysRepository.findOne =
            jest
              .fn()
              .mockImplementationOnce(async () => {
                return null;
              })
              .mockImplementationOnce(async () => {
                return cachedSymmetricKey;
              });

          result = await service.getSymmetricKey('did', 'cgwid');
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).not.toBeNull();
      });

      it('result should contain cached symmetric key', () => {
        expect(result).toBeDefined();
        expect(result).toStrictEqual(cachedSymmetricKey);
      });

      it('should not call symmetric keys refresh', () => {
        expect(
          symmetricKeysCacheServiceyMock.refreshSymmetricKeysCache
        ).toBeCalledTimes(1);
      });
    });

    describe('should fetch symmetric key from cache', () => {
      let error: Error | null;
      let result: unknown;

      const cachedSymmetricKey = {
        clientGatewayMessageId: 'cgwid',
        payload: 'payload',
        senderDid: 'senderdid',
      } as KeysEntity;

      beforeEach(async () => {
        error = null;
        result = null;

        try {
          symetricKeysRepositoryWrapperMock.symmetricKeysRepository.findOne =
            jest.fn().mockImplementationOnce(async () => {
              return cachedSymmetricKey;
            });

          result = await service.getSymmetricKey('did', 'cgwid');
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).not.toBeNull();
      });

      it('result should contain cached symmetric key', () => {
        expect(result).toBeDefined();
        expect(result).toStrictEqual(cachedSymmetricKey);
      });

      it('should not call symmetric keys refresh', () => {
        expect(
          symmetricKeysCacheServiceyMock.refreshSymmetricKeysCache
        ).toBeCalledTimes(0);
      });
    });
  });

  describe('storeKeysForMessage()', () => {
    describe('should refresh symmetric keys cache', () => {
      let error: Error | null;
      let result: unknown;

      beforeEach(async () => {
        error = null;
        result = null;

        try {
          result = await service.storeKeysForMessage();
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should call symmetric keys cache service', () => {
        expect(
          symmetricKeysCacheServiceyMock.refreshSymmetricKeysCache
        ).toBeCalledTimes(1);
      });
    });
  });
});
