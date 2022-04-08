import { KeysService } from '../../app/modules/keys/service/keys.service';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { KeysRepository } from '../../app/modules/keys/repository/keys.repository';
import { SymmetricKeysRepository } from '../../app/modules/message/repository/symmetric-keys.repository';
import { SymmetricKeysCacheService } from '../../app/modules/message/service/symmetric-keys-cache.service';
import { Wallet } from 'ethers';
import { EthersService } from '../../app/modules/utils/service/ethers.service';
import { IdentityService } from '../../app/modules/identity/service/identity.service';
import { IamInitService } from '../../app/modules/identity/service/iam-init.service';

const secretsEngineServiceMock = {
  getPrivateKey: jest.fn(),
  getRSAPrivateKey: jest.fn().mockImplementation(async () => 'key'),
  setRSAPrivateKey: jest.fn(),
};

const iamServiceMock = {
  getDid: jest.fn(),
  setVerificationMethod: jest.fn(),
};

const keysRepositoryMock = {
  storeKeys: jest.fn(),
  getSymmetricKey: jest.fn(),
};

const symmetricKeysRepositoryMock = {
  storeKeys: jest.fn(),
  getSymmetricKey: jest.fn(),
};

const symmetricKeysCacheServiceMock = {
  refreshSymmetricKeysCache: jest.fn(),
};

const iamInitServiceMock = {
  onModuleInit: jest.fn(),
};

const genRandomString = () => (Math.random() + 1).toString(36).substring(7);

const mockEthersService = {
  getWalletFromPrivateKey: jest.fn(),
};

const senderMockDid = {
  '@context': 'https://www.w3.org/ns/did/v1',
  authentication: [
    {
      type: 'owner',
      validity: {
        hex: '0x1ffffffffffffe',
        type: 'BigNumber',
      },
      publicKey:
        'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993#owner',
    },
  ],
  created: null,
  delegates: null,
  id: 'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
  service: [
    {
      id: 'b9613035-2d21-41db-8060-a3c5de0ed557',
      did: 'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
      iss: 'did:ethr:volta:0x7dD4cF86e6f143300C4550220c4eD66690a655fc',
      sub: 'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
      hash: '04a68efe006d745fc60328f0cb58b240c42ee90719b5bc10bb60df1f30eacabe',
      signer: 'did:ethr:volta:0x7dD4cF86e6f143300C4550220c4eD66690a655fc',
      hashAlg: 'SHA256',
      claimType: 'user.roles.ddhub.apps.energyweb.iam.ewc',
      issuerFields: [],
      requestorFields: [],
      serviceEndpoint: 'QmaKz3Mob9HdvKQfu5Q1MZTb9CcxG9NLi9Yh2dQUXytr8N',
      claimTypeVersion: 1,
    },
  ],
  publicKey: [
    {
      id: 'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993#dsb',
      type: 'Secp256k1pub',
      controller: '0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
      publicKeyHex:
        '035b8e0d54d389b05c8f0a4f03d6b5015fe55c39aab50d9cfe2da07da59d141f91',
    },
    {
      id: 'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993#dsb-symmetric-encryption',
      type: 'Rsapub',
      controller: '0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
      publicKeyHex:
        '-----BEGIN RSA PUBLIC KEY-----\nMIICCgKCAgEAxW+wDOz8guHv4SMXRnJuRLZv2NHlC306GvhxZOVe2nWDRtnY9YAx\nNmK8tCk7AJad7ld6isUDxd3vgt5+dqk0UHkjGGxfI/SS9p5iYQSSbrrQOn3Ro8n/\n6/UYDzxyaOmYpdLP8Bxl1cx5j4aTY1qmiJ7gntuhjXTuaiR3gMhXXTYO5Dtd6v/9\nIcGN5a33gE9qXZSyl7SKlPNdGLe3nmOrq66LkebwJMi9UB9y7KR3qUeENfiCA4+m\npSTdh8Fq0bTXfFQCp+T2OGEtPO7S6kfyjAiBUD2RXFm2yp5NGd16s5CrtKMNsm2j\noh1XJZjbClGJVlYdDZhSdrHb6V+IY4Px5lDZB9WpUi+kvGFaFX+52y/csXBd66mG\nte05IdZQQ6ZMEu7HOQsEb12MG8OmJ5tg+22Kqw8xtbbBKk91+AxdkQquViA5N3Iu\nR3fmAMaZrh+tVGzw9iwN2STUzd7GGN2b+dSX+8KgE77DQxtcOlgfyfwq0WMmkmyP\n7ZjQP4KlS3tjp8KDAknVIdQdO74v+ST8HqASqDktwnL3Si5r/I+Mw3PGZ3n8Rk3T\nO+CHbOGqC7IwMpTFUTuV5/DXSqUt25AXfb2Wn2vxAMU4+X3Dtc2QnDzvHw7nMWbU\niwlcmtpBwSJzChTWfmzZ3DVVJ+5btXVRWkGeNDeNoT6YgBBxcXxE2CMCAwEAAQ==\n-----END RSA PUBLIC KEY-----\n',
    },
    {
      id: 'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993#dsb-signature-key',
      type: 'Rsapub',
      controller: '0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
      publicKeyHex:
        '0x04851b7e4d34c39ec7e0677802f526288f71fc9a95dd14147f57f2c9823d6b334ca4c3d34bcca4b6bc09442b8791d7f245547e0f410adbaffc0bad3facd812ff99',
    },
  ],
  proof: null,
  updated: null,
};

const mockDid = {
  '@context': 'https://www.w3.org/ns/did/v1',
  authentication: [
    {
      type: 'owner',
      validity: [Object],
      publicKey:
        'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993#owner',
    },
  ],
  created: null,
  delegates: null,
  id: 'RECEIVER_DID',
  service: [
    {
      id: 'b9613035-2d21-41db-8060-a3c5de0ed557',
      did: 'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
      iss: 'did:ethr:volta:0x7dD4cF86e6f143300C4550220c4eD66690a655fc',
      sub: 'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
      hash: '04a68efe006d745fc60328f0cb58b240c42ee90719b5bc10bb60df1f30eacabe',
      signer: 'did:ethr:volta:0x7dD4cF86e6f143300C4550220c4eD66690a655fc',
      hashAlg: 'SHA256',
      claimType: 'user.roles.ddhub.apps.energyweb.iam.ewc',
      issuerFields: [],
      requestorFields: [],
      serviceEndpoint: 'QmaKz3Mob9HdvKQfu5Q1MZTb9CcxG9NLi9Yh2dQUXytr8N',
      claimTypeVersion: 1,
    },
  ],
  publicKey: [
    {
      id: 'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993#dsb',
      type: 'Secp256k1pub',
      controller: '0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
      publicKeyHex:
        '035b8e0d54d389b05c8f0a4f03d6b5015fe55c39aab50d9cfe2da07da59d141f91',
    },
  ],
  proof: null,
  updated: null,
};

const identityServiceMock = {
  getIdentity: jest.fn().mockImplementation(async () => ({
    balance: 'OK',
  })),
};

// @TODO - Revisit later
describe.skip('KeysService (SPEC)', () => {
  let keysService: KeysService;

  beforeEach(() => {
    jest.clearAllMocks();

    keysService = new KeysService(
      secretsEngineServiceMock as unknown as SecretsEngineService,
      iamServiceMock as unknown as IamService,
      keysRepositoryMock as unknown as KeysRepository,
      mockEthersService as unknown as EthersService,
      identityServiceMock as unknown as IdentityService,
      symmetricKeysRepositoryMock as unknown as SymmetricKeysRepository,
      symmetricKeysCacheServiceMock as unknown as SymmetricKeysCacheService,
      iamInitServiceMock as unknown as IamInitService
    );
  });

  describe('encryptSymmetricKey and decryptSymmetricKey', () => {
    it('should encrypt symmetric key', async () => {
      const rsaPassword = genRandomString();
      const symmetricKey = genRandomString();

      const { privateKey, publicKey } = keysService.deriveRSAKey(rsaPassword);

      iamServiceMock.getDid = jest.fn().mockImplementation(async () => ({
        ...mockDid,
        publicKey: [
          {
            id: 'RECEIVER_DID#dsb-symmetric-encryption',
            type: 'Rsapub',
            controller: '0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
            publicKeyHex: publicKey,
          },
        ],
      }));

      const encryptedSymmetricKey = await keysService.encryptSymmetricKey(
        symmetricKey,
        mockDid.id
      );

      const decryptedSymmetricKey = keysService.decryptSymmetricKey(
        privateKey,
        encryptedSymmetricKey,
        rsaPassword
      );

      expect(symmetricKey).toEqual(decryptedSymmetricKey);
    });
  });

  describe.skip('encryption flow', () => {
    it('encryption flow', async () => {
      const { privateKey: senderPrivateKey, publicKey: senderPublicKey } =
        Wallet.createRandom();

      const dataToEncrypt = JSON.stringify({
        EWT_PRICE: 100,
      });

      const rsaPassword = genRandomString();

      const {
        privateKey: receiverPrivateRSAKey,
        publicKey: receiverPublicRSAKey,
      } = keysService.deriveRSAKey(rsaPassword);

      iamServiceMock.getDid = jest.fn().mockImplementation(async () => ({
        ...mockDid,
        publicKey: [
          {
            id: 'RECEIVER_DID#dsb-symmetric-encryption',
            type: 'Rsapub',
            controller: '0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
            publicKeyHex: receiverPublicRSAKey,
          },
        ],
      }));

      const receiverDid = 'RECEIVER_DID';

      const randomKey: string = keysService.generateRandomKey();

      const encryptedSharedKey = await keysService.encryptSymmetricKey(
        randomKey,
        receiverDid
      );

      const encryptedMessage = keysService.encryptMessage(
        dataToEncrypt,
        randomKey,
        'utf-8'
      );

      const signature = keysService.createSignature(
        encryptedMessage,
        senderPrivateKey
      );

      mockEthersService.getWalletFromPrivateKey = jest
        .fn()
        .mockImplementation(() => senderMockDid.publicKey[0].publicKeyHex);

      iamServiceMock.getDid = jest.fn().mockImplementation(async () => ({
        ...senderMockDid,
        publicKey: [
          {
            id: 'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993#dsb-signature-key',
            type: 'Rsapub',
            controller: '0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
            publicKeyHex: senderPublicKey,
          },
        ],
      }));

      const isSignatureValid = await keysService.verifySignature(
        senderMockDid.id, // This should be coming from encrypted RSA public key
        signature,
        encryptedMessage
      );

      expect(isSignatureValid).toBe(true);

      const randomMessageId = genRandomString();

      keysRepositoryMock.getSymmetricKey = jest.fn().mockImplementation(() => {
        return {
          senderDid: senderMockDid.id,
          encryptedSymmetricKey: encryptedSharedKey,
          messageId: randomMessageId,
        };
      });

      symmetricKeysRepositoryMock.getSymmetricKey = jest
        .fn()
        .mockImplementation(() => {
          return {
            senderDid: senderMockDid.id,
            encryptedSymmetricKey: encryptedSharedKey,
            messageId: randomMessageId,
          };
        });

      secretsEngineServiceMock.getPrivateKey = jest
        .fn()
        .mockImplementation(async () => rsaPassword);

      secretsEngineServiceMock.getRSAPrivateKey = jest
        .fn()
        .mockImplementation(async () => receiverPrivateRSAKey);

      const decryptedMessage = await keysService.decryptMessage(
        encryptedMessage,
        randomKey,
        senderMockDid.id
      );

      expect(decryptedMessage).toEqual(dataToEncrypt);
    });
  });

  describe('onModuleInit', () => {
    it('should not execute - no root key is set', async () => {
      secretsEngineServiceMock.getPrivateKey = jest
        .fn()
        .mockImplementation(async () => null);

      await keysService.onModuleInit();

      expect(iamServiceMock.setVerificationMethod).toBeCalledTimes(0);
    });

    it('should derive keys', async () => {
      const { privateKey, publicKey } = Wallet.createRandom();

      secretsEngineServiceMock.getPrivateKey = jest
        .fn()
        .mockImplementation(async () => privateKey);

      secretsEngineServiceMock.getRSAPrivateKey = jest
        .fn()
        .mockImplementation(async () => null);

      mockEthersService.getWalletFromPrivateKey = jest
        .fn()
        .mockImplementation(() => publicKey);

      await keysService.onModuleInit();

      expect(iamServiceMock.setVerificationMethod).toBeCalledTimes(2);
      expect(secretsEngineServiceMock.setRSAPrivateKey).toBeCalledTimes(1);
    });
  });
});
