import { ConfigService } from '@nestjs/config';
import {
  SecretClient,
  KeyVaultSecret,
  SecretProperties,
} from '@azure/keyvault-secrets';
import { AzureKeyVaultService } from './azure-key-vault.service';
import { Test } from '@nestjs/testing';
import { getPagedAsyncIterator } from '@azure/core-paging';

jest.mock('@azure/identity');
jest.mock('@azure/keyvault-secrets');
const mockConfigService = {
  get: jest.fn(),
};

describe(`${AzureKeyVaultService.name}`, () => {
  let service: AzureKeyVaultService;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockConfigService.get = jest.fn().mockImplementationOnce(() => 'ddhub/');

    const module = await Test.createTestingModule({
      providers: [
        AzureKeyVaultService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AzureKeyVaultService>(AzureKeyVaultService);
    await service.onModuleInit();
  });

  it('should get an RSA Private Key', async () => {
    const SecretString = 'test_rsa_key';

    jest.spyOn(SecretClient.prototype, 'getSecret').mockResolvedValueOnce({
      name: 'test',
      value: 'test_rsa_key',
      properties: {
        vaultUrl: '',
        version: '',
        name: '',
      },
    });

    const key = await service.getRSAPrivateKey();
    expect(key).toBeDefined();
    expect(key).toEqual(SecretString);
  });

  it('should return null for an RSA Private Key that does not exist', async () => {
    jest
      .spyOn(SecretClient.prototype, 'getSecret')
      .mockRejectedValueOnce(new Error('Secret does not exist'));

    const key = await service.getRSAPrivateKey();
    expect(key).toBeNull();
  });

  it('should create/update an RSA Private Key', async () => {
    jest.spyOn(SecretClient.prototype, 'setSecret').mockResolvedValueOnce({
      name: 'ddhub-rsa-key',
      value: 'test key',
      properties: {
        vaultUrl: '',
        version: '',
        name: '',
      },
    });

    const key: KeyVaultSecret = await service.setRSAPrivateKey('test key');
    expect(key).toBeDefined();
    if (key && key.name) {
      expect(key.name).toEqual('ddhub-rsa-key');
    }
  });

  it('should get a Private Identity Key', async () => {
    const SecretString = 'test_identity_key';

    jest.spyOn(SecretClient.prototype, 'getSecret').mockResolvedValueOnce({
      name: 'test',
      value: 'test_identity_key',
      properties: {
        vaultUrl: '',
        version: '',
        name: '',
      },
    });

    const key = await service.getPrivateKey();
    expect(key).toBeDefined();
    expect(key).toEqual(SecretString);
  });

  it('should return null for a Private Identity Key that does not exist', async () => {
    jest
      .spyOn(SecretClient.prototype, 'getSecret')
      .mockRejectedValueOnce(new Error('Secret does not exist'));

    const key = await service.getPrivateKey();
    expect(key).toBeNull();
  });

  it('should create/update a Private Identity Key', async () => {
    const name = 'ddhub-identity-private-key';
    jest.spyOn(SecretClient.prototype, 'setSecret').mockResolvedValueOnce({
      name,
      value: 'test key',
      properties: {
        vaultUrl: '',
        version: '',
        name: '',
      },
    });

    const key = await service.setPrivateKey('test key');
    expect(key).toBeDefined();
    if (key && key.name) {
      expect(key.name).toEqual(name);
    }
  });

  it('should get Certificate Details secret', async () => {
    const testData = {
      privateKey: {
        Name: 'ddhub-certificate-private-key',
        SecretString: 'test_private_key',
      },
      certificate: {
        Name: 'ddhub-certificate-certificate',
        SecretString: 'test_certificate',
      },
      caCertificate: {
        Name: 'ddhub-certificate-ca-certificate',
        SecretString: 'test_ca_certificate',
      },
    };

    jest
      .spyOn(SecretClient.prototype, 'getSecret')
      .mockResolvedValueOnce({
        name: 'ddhub-certificate-private-key',
        value: 'test_private_key',
        properties: {
          vaultUrl: '',
          version: '',
          name: '',
        },
      })
      .mockResolvedValueOnce({
        name: 'ddhub-certificate-certificate',
        value: 'test_certificate',
        properties: {
          vaultUrl: '',
          version: '',
          name: '',
        },
      })
      .mockResolvedValueOnce({
        name: 'ddhub-certificate-ca-certificate',
        value: 'test_ca_certificate',
        properties: {
          vaultUrl: '',
          version: '',
          name: '',
        },
      });

    const details = await service.getCertificateDetails();
    expect(details).toBeDefined();
    for (const key in details) {
      expect(details[key]).toBeDefined();
      expect(details[key]).toEqual(testData[key].SecretString);
    }
  });

  it('should return null for each Certificate Details secret that does not exist', async () => {
    jest
      .spyOn(SecretClient.prototype, 'getSecret')
      .mockRejectedValueOnce(new Error('Secret does not exist'))
      .mockRejectedValueOnce(new Error('Secret does not exist'))
      .mockRejectedValueOnce(new Error('Secret does not exist'));

    const details = await service.getCertificateDetails();
    expect(details).toBeDefined();
    for (const key in details) {
      expect(details[key]).toBeNull();
    }
  });

  it('should create/update a Certificate Details secret', async () => {
    jest
      .spyOn(SecretClient.prototype, 'setSecret')
      .mockResolvedValueOnce({
        name: 'ddhub-certificate-private-key',
        value: 'test_private_key',
        properties: {
          vaultUrl: '',
          version: '',
          name: '',
        },
      })
      .mockResolvedValueOnce({
        name: 'ddhub-certificate-certificate',
        value: 'test_certificate',
        properties: {
          vaultUrl: '',
          version: '',
          name: '',
        },
      })
      .mockResolvedValueOnce({
        name: 'ddhub-certificate-ca-certificate',
        value: 'test_ca_certificate',
        properties: {
          vaultUrl: '',
          version: '',
          name: '',
        },
      });

    const details = await service.setCertificateDetails({
      privateKey: 'test_private_key',
      certificate: 'test_certificate',
      caCertificate: 'test_ca_certificate',
    });
    expect(details).toBeDefined();
    if (details && details.length) {
      for (const cert of details) {
        expect(cert.name).toMatch(/^ddhub-certificate-?/);
      }
    }
  });

  it('should rollback all Certificate Details secrets if one fails', async () => {
    jest.spyOn(SecretClient.prototype, 'beginDeleteSecret').mockResolvedValue({
      poll: jest.fn(),
      onProgress: jest.fn(),
      pollUntilDone: jest.fn().mockImplementation(() => Promise.resolve(true)),
      isDone: jest.fn(),
      stopPolling: jest.fn(),
      isStopped: jest.fn(),
      getResult: jest.fn(),
      cancelOperation: jest.fn(),
      getOperationState: jest.fn(),
    });
    jest
      .spyOn(SecretClient.prototype, 'setSecret')
      .mockResolvedValueOnce({
        name: 'ddhub-certificate-private-key',
        value: 'test_private_key',
        properties: {
          vaultUrl: '',
          version: '',
          name: '',
        },
      })
      .mockRejectedValueOnce(new Error('Test error'));

    const details = await service.setCertificateDetails({
      privateKey: 'test_private_key',
      certificate: 'test_certificate',
    });
    expect(details).toBeNull();
  });

  it('should delete all Azure KV secrets', async () => {
    jest.spyOn(SecretClient.prototype, 'beginDeleteSecret').mockResolvedValue({
      poll: jest.fn(),
      onProgress: jest.fn(),
      pollUntilDone: jest.fn().mockImplementation(() => Promise.resolve(true)),
      isDone: jest.fn(),
      stopPolling: jest.fn(),
      isStopped: jest.fn(),
      getResult: jest.fn(),
      cancelOperation: jest.fn(),
      getOperationState: jest.fn(),
    });

    const response = await service.deleteAll();
    expect(response).toBeUndefined();
  });

  it('should list all User secrets', async () => {
    const testUsername = 'test-user-1';
    const testData = {
      password: 'test_password',
      role: 'test_role',
    };

    jest.spyOn(SecretClient.prototype, 'getSecret').mockResolvedValueOnce({
      name: `ddhub-users-${testUsername}`,
      value: JSON.stringify(testData),
      properties: {
        vaultUrl: '',
        name: `ddhub-users-${testUsername}`,
      },
    });

    jest
      .spyOn(SecretClient.prototype, 'listPropertiesOfSecrets')
      .mockReturnValue(
        getPagedAsyncIterator<SecretProperties>({
          firstPageLink: '',
          getPage: () =>
            Promise.resolve({
              page: <SecretProperties[]>[
                {
                  name: `ddhub-users-${testUsername}`,
                  vaultUrl: '',
                  enabled: true,
                },
                {
                  name: 'some-other-secret',
                  vaultUrl: '',
                  enabled: true,
                },
              ],
            }),
        })
      );

    const response = await service.getAllUsers();
    expect(response).toBeDefined();
    expect(response.length).toBe(1);
    expect(response[0]).toStrictEqual({
      username: testUsername,
      ...testData,
    });
  });

  it('should return empty when no user secrets exist', async () => {
    jest
      .spyOn(SecretClient.prototype, 'listPropertiesOfSecrets')
      .mockReturnValue(
        getPagedAsyncIterator<SecretProperties>({
          firstPageLink: '',
          getPage: () =>
            Promise.resolve({
              page: <SecretProperties[]>[
                {
                  name: 'some-other-secret',
                  vaultUrl: '',
                  enabled: true,
                },
              ],
            }),
        })
      );

    const response = await service.getAllUsers();
    expect(response).toBeDefined();
    expect(response).toStrictEqual([]);
    expect(response.length).toBe(0);
  });

  it('should return valid user details when retrieving with a username', async () => {
    const testUsername = 'test-user-1';
    const testData = {
      password: 'test_password',
      role: 'test_role',
    };

    jest.spyOn(SecretClient.prototype, 'getSecret').mockResolvedValueOnce({
      name: `ddhub-users-${testUsername}`,
      value: JSON.stringify(testData),
      properties: {
        vaultUrl: '',
        name: `ddhub-users-${testUsername}`,
      },
    });

    const response = await service.getUserAuthDetails(testUsername);
    expect(response).toBeDefined();
    expect(response).toStrictEqual({
      username: testUsername,
      ...testData,
    });
  });

  it('should return null when a secret value is invalid', async () => {
    const testUsername = 'test-user-1';
    jest.spyOn(SecretClient.prototype, 'getSecret').mockResolvedValueOnce({
      name: `ddhub-users-${testUsername}`,
      value: 'invalid',
      properties: {
        vaultUrl: '',
        name: `ddhub-users-${testUsername}`,
      },
    });

    const response = await service.getUserAuthDetails(testUsername);
    expect(response).toBeNull();
  });

  it("should return null when a secret doesn't exist", async () => {
    jest
      .spyOn(SecretClient.prototype, 'getSecret')
      .mockRejectedValueOnce(new Error('Secret does not exist'));

    const response = await service.getUserAuthDetails('test-user-1');
    expect(response).toBeNull();
  });
});
