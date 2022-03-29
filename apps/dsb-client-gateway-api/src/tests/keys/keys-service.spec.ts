import { KeysService } from '../../app/modules/keys/service/keys.service';
import { SecretsEngineService } from '../../app/modules/secrets-engine/secrets-engine.interface';
import { IamService } from '../../app/modules/iam-service/service/iam.service';
import { KeysRepository } from '../../app/modules/keys/repository/keys.repository';
import { Wallet } from 'ethers';

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
    ,
  ],
  proof: null,
  updated: null,
};
describe('KeysService (SPEC)', () => {
  let keysService: KeysService;

  beforeEach(() => {
    jest.clearAllMocks();

    keysService = new KeysService(
      secretsEngineServiceMock as unknown as SecretsEngineService,
      iamServiceMock as unknown as IamService,
      keysRepositoryMock as unknown as KeysRepository
    );
  });

  describe('encryptSymmetricKey and decryptSymmetricKey', () => {
    it('should encrypt symmetric key', async () => {
      const genRandomString = () =>
        (Math.random() + 1).toString(36).substring(7);

      const rsaPassword = genRandomString();
      const symmetricKey = genRandomString();

      const { privateKey, publicKey } = keysService.deriveRSAKey(rsaPassword);

      iamServiceMock.getDid = jest.fn().mockImplementation(async () => ({
        ...mockDid,
        publicKey: [
          {
            id: 'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993#dsb-symmetric-encryption',
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

  describe('encryption flow', () => {
    it('encryption flow', () => {
      const { privateKey: senderPrivateKey } = Wallet.createRandom();

      const { privateKey: receiverPrivateKey } = Wallet.createRandom();

      const dataToEncrypt = JSON.stringify({
        EWT_PRICE: 100,
      });

      const [senderDerivedKey, receiverDerivedKey] = [
        keysService.getDerivedKey(receiverPrivateKey),
        keysService.getDerivedKey(senderPrivateKey),
      ];

      const sharedKey = keysService.computeSharedKey(
        senderDerivedKey.privateKey.toString('hex'),
        receiverDerivedKey.publicKey.toString('hex')
      );

      const encryptedMessage = keysService.encryptMessage(
        dataToEncrypt,
        sharedKey,
        'utf-8'
      );

      const signature = keysService.createSignature(
        encryptedMessage,
        senderDerivedKey.privateKey
      );

      const isSignatureValid = keysService.verifySignature(
        senderDerivedKey.publicKey, // This should be coming from encrypted RSA public key
        signature,
        encryptedMessage
      );

      expect(isSignatureValid).toBe(true);

      const decryptedMessage = keysService.decryptMessage(
        encryptedMessage,
        receiverDerivedKey.privateKey.toString('hex'),
        senderDerivedKey.publicKey.toString('hex')
      );

      expect(dataToEncrypt).toEqual(decryptedMessage);
    });
  });

  describe('getDerivedKey', () => {
    it('should derive key', async () => {
      const randomPrivateKey: string = Wallet.createRandom().privateKey;

      const hdkey = await keysService.getDerivedKey(randomPrivateKey);

      expect(hdkey).toBeDefined();
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
      const randomPrivateKey: string = Wallet.createRandom().privateKey;

      secretsEngineServiceMock.getPrivateKey = jest
        .fn()
        .mockImplementation(async () => randomPrivateKey);

      secretsEngineServiceMock.getRSAPrivateKey = jest
        .fn()
        .mockImplementation(async () => null);

      await keysService.onModuleInit();

      expect(iamServiceMock.setVerificationMethod).toBeCalledTimes(1);
    });
  });
});
