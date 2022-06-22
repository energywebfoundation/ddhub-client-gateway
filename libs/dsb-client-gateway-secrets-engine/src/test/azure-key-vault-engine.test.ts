import { ConfigService } from '@nestjs/config';
import { SecretClient, KeyVaultSecret } from '@azure/keyvault-secrets';
import { AzureKeyVaultService } from '../lib/service/azure-key-vault.service';

jest.mock('@azure/keyvault-secrets');

describe('Azure Key Vault Engine', () => {
  const service = new AzureKeyVaultService(new ConfigService());

  beforeAll(async () => {
    await service.onModuleInit();
  });

  beforeEach(() => {
    (SecretClient as any).mockClear();
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
});
