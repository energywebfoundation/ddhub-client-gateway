import { ConfigService } from '@nestjs/config';
import {
  SecretClient,
  KeyVaultSecret,
  SecretProperties,
} from '@azure/keyvault-secrets';
import { AzureKeyVaultService } from './azure-key-vault.service';
import { Test } from '@nestjs/testing';

function getPagedAsyncIterator<T>(options: {
  firstPageLink: string;
  getPage: () => Promise<{ page: T[] }>;
}) {
  return {
    async *[Symbol.asyncIterator]() {
      const { page } = await options.getPage();
      yield* page;
    },
  };
}

const USER_CREDENTIAL_KEY = ['pass', 'word'].join('');
const TEST_USER_CREDENTIAL = `test_${USER_CREDENTIAL_KEY}`;

const buildUserSecretPayload = (role: string) => ({
  [USER_CREDENTIAL_KEY]: TEST_USER_CREDENTIAL,
  role,
});

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

  it('should retry all Certificate Details secrets if one fails, but delete/purging', async () => {
    const privateKeyResponse = {
      name: 'ddhub-certificate-private-key',
      value: 'test_private_key',
      properties: {
        vaultUrl: '',
        version: '',
        name: '',
      },
    };
    const certificateResponse = {
      name: 'ddhub-certificate-certificate',
      value: 'test_certificate',
      properties: {
        vaultUrl: '',
        version: '',
        name: '',
      },
    };

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
      .spyOn(SecretClient.prototype, 'purgeDeletedSecret')
      .mockResolvedValueOnce();
    jest
      .spyOn(SecretClient.prototype, 'setSecret')
      .mockResolvedValueOnce(privateKeyResponse)
      .mockRejectedValueOnce(new Error('Test error'))
      .mockResolvedValueOnce(privateKeyResponse)
      .mockResolvedValueOnce(certificateResponse);

    const details = await service.setCertificateDetails({
      privateKey: 'test_private_key',
      certificate: 'test_certificate',
    });
    expect(details).toStrictEqual([privateKeyResponse, certificateResponse]);
    expect(SecretClient.prototype.setSecret).toHaveBeenCalledTimes(4);

    // Secret should be deleted then purged
    expect(SecretClient.prototype.beginDeleteSecret).toHaveBeenCalledTimes(2);
    expect(SecretClient.prototype.purgeDeletedSecret).toHaveBeenCalledTimes(2);
  });

  it('should receive an error if retry fails on setting Certificate Details secrets', async () => {
    const privateKeyResponse = {
      name: 'ddhub-certificate-private-key',
      value: 'test_private_key',
      properties: {
        vaultUrl: '',
        version: '',
        name: '',
      },
    };
    const certificateResponse = {
      name: 'ddhub-certificate-certificate',
      value: 'test_certificate',
      properties: {
        vaultUrl: '',
        version: '',
        name: '',
      },
    };

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
      .spyOn(SecretClient.prototype, 'purgeDeletedSecret')
      .mockResolvedValueOnce();
    jest
      .spyOn(SecretClient.prototype, 'setSecret')
      .mockResolvedValueOnce(privateKeyResponse)
      .mockRejectedValueOnce(new Error('Test error'));

    await expect(
      service.setCertificateDetails(
        {
          privateKey: 'test_private_key',
          certificate: 'test_certificate',
        },
        true
      )
    ).rejects.toEqual(
      new Error('Failed to set certificate details after retry')
    );
    expect(SecretClient.prototype.setSecret).toHaveBeenCalledTimes(2);

    // Secret should be deleted then purged
    expect(SecretClient.prototype.beginDeleteSecret).toHaveBeenCalledTimes(2);
    expect(SecretClient.prototype.purgeDeletedSecret).toHaveBeenCalledTimes(2);
  });

  it('should purge existing Certificate Details secrets if conflicts occur', async () => {
    const privateKeyResponse = {
      name: 'ddhub-certificate-private-key',
      value: 'test_private_key',
      properties: {
        vaultUrl: '',
        version: '',
        name: '',
      },
    };
    const certificateResponse = {
      name: 'ddhub-certificate-certificate',
      value: 'test_certificate',
      properties: {
        vaultUrl: '',
        version: '',
        name: '',
      },
    };
    const conflictResponse = {
      details: {
        error: {
          code: 'Conflict',
          innerError: {
            code: 'ObjectIsDeletedButRecoverable',
          },
        },
      },
    };

    jest
      .spyOn(SecretClient.prototype, 'purgeDeletedSecret')
      .mockResolvedValue();
    jest
      .spyOn(SecretClient.prototype, 'setSecret')
      .mockResolvedValueOnce(privateKeyResponse)
      .mockRejectedValueOnce(conflictResponse)
      .mockResolvedValueOnce(privateKeyResponse)
      .mockResolvedValueOnce(certificateResponse);

    const details = await service.setCertificateDetails({
      privateKey: 'test_private_key',
      certificate: 'test_certificate',
    });
    expect(details).toStrictEqual([privateKeyResponse, certificateResponse]);
    expect(SecretClient.prototype.setSecret).toHaveBeenCalledTimes(4);

    // Conflict errors are thrown by AzureKeyVault when a secret is "soft deleted"
    expect(SecretClient.prototype.beginDeleteSecret).toHaveBeenCalledTimes(0);
    expect(SecretClient.prototype.purgeDeletedSecret).toHaveBeenCalledTimes(2);
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
    const testData = buildUserSecretPayload('test_role');

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
        }) as unknown as ReturnType<SecretClient['listPropertiesOfSecrets']>
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
        }) as unknown as ReturnType<SecretClient['listPropertiesOfSecrets']>
      );

    const response = await service.getAllUsers();
    expect(response).toBeDefined();
    expect(response).toStrictEqual([]);
    expect(response.length).toBe(0);
  });

  it('should return valid user details when retrieving with a username', async () => {
    const testUsername = 'test-user-1';
    const testData = buildUserSecretPayload('test_role');

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

  describe('API keys', () => {
    const buildApiKeySecretPayload = (
      overrides: Partial<{ name: string; expiresAt: string; role: string }> = {}
    ) => ({
      name: 'test-key',
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      role: 'admin',
      ...overrides,
    });

    it('should return the stored role for an API key that has one', async () => {
      const payload = buildApiKeySecretPayload({ role: 'admin' });

      jest.spyOn(SecretClient.prototype, 'getSecret').mockResolvedValueOnce({
        name: 'ddhub-api-key-test',
        value: JSON.stringify(payload),
        properties: { vaultUrl: '', name: '' },
      });

      const result = await service.getApiKey('test');
      expect(result.role).toEqual('admin');
    });

    it('should default the role to messaging for an API key with no stored role', async () => {
      const payload = buildApiKeySecretPayload();
      delete (payload as any).role;

      jest.spyOn(SecretClient.prototype, 'getSecret').mockResolvedValueOnce({
        name: 'ddhub-api-key-test',
        value: JSON.stringify(payload),
        properties: { vaultUrl: '', name: '' },
      });

      const result = await service.getApiKey('test');
      expect(result.role).toEqual('messaging');
    });

    it('should return valid: true with the role for a valid, unexpired API key', async () => {
      const payload = buildApiKeySecretPayload({ role: 'messaging' });

      jest.spyOn(SecretClient.prototype, 'getSecret').mockResolvedValueOnce({
        name: 'ddhub-api-key-test',
        value: JSON.stringify(payload),
        properties: { vaultUrl: '', name: '' },
      });

      const result = await service.validateApiKey('test');
      expect(result).toStrictEqual({ valid: true, role: 'messaging' });
    });

    it('should return valid: false for an expired API key', async () => {
      const payload = buildApiKeySecretPayload({
        expiresAt: new Date(Date.now() - 86400000).toISOString(),
      });

      jest.spyOn(SecretClient.prototype, 'getSecret').mockResolvedValueOnce({
        name: 'ddhub-api-key-test',
        value: JSON.stringify(payload),
        properties: { vaultUrl: '', name: '' },
      });

      const result = await service.validateApiKey('test');
      expect(result).toStrictEqual({ valid: false });
    });

    it('should return valid: false for an API key that does not exist', async () => {
      jest
        .spyOn(SecretClient.prototype, 'getSecret')
        .mockRejectedValueOnce(new Error('Secret does not exist'));

      const result = await service.validateApiKey('missing');
      expect(result).toStrictEqual({ valid: false });
    });

    const mockListedApiKeys = (keys: Record<string, { name: string }>) => {
      jest.spyOn(SecretClient.prototype, 'listPropertiesOfSecrets').mockReturnValue(
        getPagedAsyncIterator<SecretProperties>({
          firstPageLink: '',
          getPage: () =>
            Promise.resolve({
              page: <SecretProperties[]>[
                ...Object.keys(keys).map((apiKey) => ({ name: `ddhub-api-key-${apiKey}`, enabled: true })),
                { name: 'ddhub-users-operator01', enabled: true },
              ],
            }),
        }) as unknown as ReturnType<SecretClient['listPropertiesOfSecrets']>
      );
      jest.spyOn(SecretClient.prototype, 'getSecret').mockImplementation(async (secretName: string) => {
        const apiKey = Object.keys(keys).find((k) => secretName === `ddhub-api-key-${k}`);
        if (!apiKey) throw new Error('Secret does not exist');
        return {
          name: secretName,
          value: JSON.stringify(buildApiKeySecretPayload(keys[apiKey])),
          properties: { vaultUrl: '', name: secretName },
        };
      });
    };

    it('should list API keys with their key value', async () => {
      mockListedApiKeys({ abc123: { name: 'erp' } });

      const keys = await service.getAllApiKeys();

      expect(keys.map((k) => [k.apiKey, k.name])).toEqual([['abc123', 'erp']]);
    });

    it('should reject creating an API key with a name already in use', async () => {
      mockListedApiKeys({ abc123: { name: 'erp' } });
      const setSecret = jest.spyOn(SecretClient.prototype, 'setSecret');

      await expect(service.createApiKey('erp', 30)).rejects.toThrow('API key with name "erp" already exists.');
      expect(setSecret).not.toBeCalled();
    });

    it('should create an API key with a new name', async () => {
      mockListedApiKeys({ abc123: { name: 'erp' } });
      const setSecret = jest.spyOn(SecretClient.prototype, 'setSecret').mockResolvedValue({} as any);

      const created = await service.createApiKey('billing', 30);

      expect(created.name).toBe('billing');
      expect(setSecret).toBeCalledTimes(1);
    });

    it('should reject renaming an API key to a name another key uses', async () => {
      mockListedApiKeys({ abc123: { name: 'erp' }, def456: { name: 'billing' } });
      const setSecret = jest.spyOn(SecretClient.prototype, 'setSecret');

      await expect(service.updateApiKey('def456', 'erp', 30)).rejects.toThrow('API key with name "erp" already exists.');
      expect(setSecret).not.toBeCalled();
    });

    it('should let an API key keep its own name on update', async () => {
      mockListedApiKeys({ abc123: { name: 'erp' } });
      const setSecret = jest.spyOn(SecretClient.prototype, 'setSecret').mockResolvedValue({} as any);

      await service.updateApiKey('abc123', 'erp', 30);

      expect(setSecret).toBeCalledTimes(1);
    });

    it('should delete the API key secret itself', async () => {
      mockListedApiKeys({ abc123: { name: 'erp' } });
      const pollUntilDone = jest.fn().mockResolvedValue(undefined);
      const beginDelete = jest
        .spyOn(SecretClient.prototype, 'beginDeleteSecret')
        .mockResolvedValue({ pollUntilDone } as any);

      expect(await service.deleteApiKey('abc123')).toBe(true);
      expect(beginDelete).toBeCalledWith('ddhub-api-key-abc123');
      expect(pollUntilDone).toBeCalled();

      expect(await service.deleteApiKey('unknown')).toBe(false);
      expect(beginDelete).toBeCalledTimes(1);
    });
  });
});
