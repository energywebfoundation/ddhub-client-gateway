import {
  CreateSecretCommand,
  DeleteSecretCommand,
  GetSecretValueCommand,
  ListSecretsCommand,
  PutSecretValueCommand,
  ResourceNotFoundException,
  SecretsManagerClient,
  UpdateSecretCommand,
} from '@aws-sdk/client-secrets-manager';
import { ConfigService } from '@nestjs/config';
import { AwsSecretsManagerService } from './aws-secrets-manager.service';
import { mockClient } from 'aws-sdk-client-mock';
import { UserRole } from '../../secrets-engine.interface';

describe('AWS Secrets Manager Engine', () => {
  const service = new AwsSecretsManagerService(new ConfigService());

  beforeAll(async () => {
    await service.onModuleInit();
  });

  it('should get an RSA Private Key', async () => {
    const smMockClient = mockClient(SecretsManagerClient);
    const SecretString = 'test_rsa_key';

    smMockClient.on(GetSecretValueCommand).resolves({
      Name: '/ddhub/rsa_key',
      SecretString,
    });

    const key = await service.getRSAPrivateKey();
    expect(key).toBeDefined();
    expect(key).toEqual(SecretString);
  });

  it('should return null for an RSA Private Key that does not exist', async () => {
    const smMockClient = mockClient(SecretsManagerClient);

    smMockClient
      .on(GetSecretValueCommand)
      .rejectsOnce(
        new ResourceNotFoundException({ Message: 'test', message: 'test', $metadata: {} })
      );

    const key = await service.getRSAPrivateKey();
    expect(key).toBeNull();
  });

  it('should create an RSA Private Key if it does not exist', async () => {
    const smMockClient = mockClient(SecretsManagerClient);

    smMockClient
      .on(PutSecretValueCommand)
      .rejects(
        new ResourceNotFoundException({ Message: 'test', message: 'test', $metadata: {} })
      );
    smMockClient.on(CreateSecretCommand).resolves({
      Name: '/ddhub/rsa_key',
    });

    const key = await service.setRSAPrivateKey('test key');
    expect(key).toBeDefined();
    if (key && key.Name) {
      expect(key.Name).toEqual('/ddhub/rsa_key');
    }
  });

  it('should update an existing RSA Private Key', async () => {
    const smMockClient = mockClient(SecretsManagerClient);

    smMockClient.on(PutSecretValueCommand).resolves({
      Name: '/ddhub/rsa_key',
    });

    const key = await service.setRSAPrivateKey('test key');
    expect(key).toBeDefined();
    if (key && key.Name) {
      expect(key.Name).toEqual('/ddhub/rsa_key');
    }
  });

  it('should get a Private Identity Key', async () => {
    const smMockClient = mockClient(SecretsManagerClient);
    const SecretString = 'test_identity_key';

    smMockClient.on(GetSecretValueCommand).resolves({
      Name: '/ddhub/identity/private_key',
      SecretString,
    });

    const key = await service.getPrivateKey();
    expect(key).toBeDefined();
    expect(key).toEqual(SecretString);
  });

  it('should return null for a Private Identity Key that does not exist', async () => {
    const smMockClient = mockClient(SecretsManagerClient);

    smMockClient.on(GetSecretValueCommand).rejectsOnce(
      new ResourceNotFoundException({
        Message: 'test',
        message: 'test',
        $metadata: {},
      })
    );

    const key = await service.getPrivateKey();
    expect(key).toBeNull();
  });

  it('should create a Private Identity Key if it does not exist', async () => {
    const smMockClient = mockClient(SecretsManagerClient);

    smMockClient
      .on(PutSecretValueCommand)
      .rejects(
        new ResourceNotFoundException({ Message: 'test', message: 'test', $metadata: {} })
      );
    smMockClient.on(CreateSecretCommand).resolves({
      Name: '/ddhub/identity/private_key',
    });

    const key = await service.setPrivateKey('test key');
    expect(key).toBeDefined();
    if (key && key.Name) {
      expect(key.Name).toEqual('/ddhub/identity/private_key');
    }
  });

  it('should update a Private Identity Key', async () => {
    const smMockClient = mockClient(SecretsManagerClient);

    smMockClient.on(PutSecretValueCommand).resolves({
      Name: '/ddhub/identity/private_key',
    });

    const key = await service.setPrivateKey('test key');
    expect(key).toBeDefined();
    if (key && key.Name) {
      expect(key.Name).toEqual('/ddhub/identity/private_key');
    }
  });

  it('should get Certificate Details secret', async () => {
    const smMockClient = mockClient(SecretsManagerClient);

    const testData = {
      privateKey: {
        Name: '/ddhub/certificate/private_key',
        SecretString: 'test_private_key',
      },
      certificate: {
        Name: '/ddhub/certificate/certificate',
        SecretString: 'test_certificate',
      },
      caCertificate: {
        Name: '/ddhub/certificate/ca_certificate',
        SecretString: 'test_ca_certificate',
      },
    };

    smMockClient
      .on(GetSecretValueCommand)
      .resolvesOnce({
        Name: testData.privateKey.SecretString,
        SecretString: testData.privateKey.SecretString,
      })
      .resolvesOnce({
        Name: testData.certificate.SecretString,
        SecretString: testData.certificate.SecretString,
      })
      .resolvesOnce({
        Name: testData.caCertificate.SecretString,
        SecretString: testData.caCertificate.SecretString,
      });
    const details = await service.getCertificateDetails();
    expect(details).toBeDefined();
    for (const key in details) {
      expect(details[key]).toBeDefined();
      expect(details[key]).toEqual(testData[key].SecretString);
    }
  });

  it('should return null for each Certificate Details secret that does not exist', async () => {
    const smMockClient = mockClient(SecretsManagerClient);

    smMockClient
      .on(GetSecretValueCommand)
      .rejectsOnce(
        new ResourceNotFoundException({ Message: 'test', message: 'test', $metadata: {} })
      )
      .rejectsOnce(
        new ResourceNotFoundException({ Message: 'test', message: 'test', $metadata: {} })
      )
      .rejectsOnce(
        new ResourceNotFoundException({ Message: 'test', message: 'test', $metadata: {} })
      );
    const details = await service.getCertificateDetails();
    expect(details).toBeDefined();
    for (const key in details) {
      expect(details[key]).toBeNull();
    }
  });

  it('should create a Certificate Details secret if it does not exist', async () => {
    const smMockClient = mockClient(SecretsManagerClient);

    smMockClient
      .on(PutSecretValueCommand)
      .rejectsOnce(
        new ResourceNotFoundException({ Message: 'test', message: 'test', $metadata: {} })
      )
      .rejectsOnce(
        new ResourceNotFoundException({ Message: 'test', message: 'test', $metadata: {} })
      )
      .rejectsOnce(
        new ResourceNotFoundException({ Message: 'test', message: 'test', $metadata: {} })
      );
    smMockClient
      .on(CreateSecretCommand)
      .resolvesOnce({
        Name: '/ddhub/certificate/private_key',
      })
      .resolvesOnce({
        Name: '/ddhub/certificate/certificate',
      })
      .resolvesOnce({
        Name: '/ddhub/certificate/ca_certificate',
      });

    const details = await service.setCertificateDetails({
      privateKey: 'test_private_key',
      certificate: 'test_certificate',
      caCertificate: 'test_ca_certificate',
    });
    expect(details).toBeDefined();
    if (details && details.length) {
      for (const cert of details) {
        expect(cert.Name).toMatch(/^\/ddhub\/certificate\/?/);
      }
    }
  });

  it('should update Certificate Details secret', async () => {
    const smMockClient = mockClient(SecretsManagerClient);

    smMockClient
      .on(PutSecretValueCommand)
      .resolvesOnce({
        Name: '/ddhub/certificate/private_key',
      })
      .resolvesOnce({
        Name: '/ddhub/certificate/certificate',
      })
      .resolvesOnce({
        Name: '/ddhub/certificate/ca_certificate',
      });

    const details = await service.setCertificateDetails({
      privateKey: 'test_private_key',
      certificate: 'test_certificate',
      caCertificate: 'test_ca_certificate',
    });
    expect(details).toBeDefined();
    if (details && details.length) {
      for (const cert of details) {
        expect(cert.Name).toMatch(/^\/ddhub\/certificate\/?/);
      }
    }
  });

  describe('Users', () => {
    const notFound = () =>
      new ResourceNotFoundException({ Message: 'test', message: 'test', $metadata: {} });

    it('should finish writing an existing user before resolving', async () => {
      const smMockClient = mockClient(SecretsManagerClient);
      let written = false;
      smMockClient.on(PutSecretValueCommand).callsFake(async () => {
        await new Promise((r) => setTimeout(r, 10));
        written = true;
        return {};
      });

      await service.setUserPassword('operator01', 'pass', UserRole.ADMIN);

      expect(written).toBe(true);
      expect(smMockClient.commandCalls(PutSecretValueCommand)[0].args[0].input).toEqual({
        SecretId: '/ddhub/users/operator01',
        SecretString: JSON.stringify({ password: 'pass', role: UserRole.ADMIN }),
      });
    });

    it('should create the secret of a new user before resolving', async () => {
      const smMockClient = mockClient(SecretsManagerClient);
      let created = false;
      smMockClient.on(PutSecretValueCommand).rejects(notFound());
      smMockClient.on(CreateSecretCommand).callsFake(async () => {
        await new Promise((r) => setTimeout(r, 10));
        created = true;
        return {};
      });

      await service.setUserPassword('operator02', 'pass', UserRole.MESSAGING);

      expect(created).toBe(true);
      expect(smMockClient.commandCalls(CreateSecretCommand)[0].args[0].input.Name).toBe('/ddhub/users/operator02');
    });

    it('should reject when the user cannot be written', async () => {
      const smMockClient = mockClient(SecretsManagerClient);
      smMockClient.on(PutSecretValueCommand).rejects(new Error('AccessDenied'));

      await expect(service.setUserPassword('operator03', 'pass', UserRole.ADMIN)).rejects.toThrow('AccessDenied');
    });

    it('should reject when creating a new user fails', async () => {
      const smMockClient = mockClient(SecretsManagerClient);
      smMockClient.on(PutSecretValueCommand).rejects(notFound());
      smMockClient.on(CreateSecretCommand).rejects(new Error('AccessDenied'));

      await expect(service.setUserPassword('operator04', 'pass', UserRole.ADMIN)).rejects.toThrow('AccessDenied');
    });

    it('should finish deleting a user before resolving, and ignore unknown users', async () => {
      const smMockClient = mockClient(SecretsManagerClient);
      let deleted = false;
      smMockClient.on(DeleteSecretCommand).callsFakeOnce(async () => {
        await new Promise((r) => setTimeout(r, 10));
        deleted = true;
        return {};
      });

      await service.deleteUser('operator01');
      expect(deleted).toBe(true);

      smMockClient.on(DeleteSecretCommand).rejects(notFound());
      await expect(service.deleteUser('unknown')).resolves.toBeUndefined();

      smMockClient.on(DeleteSecretCommand).rejects(new Error('AccessDenied'));
      await expect(service.deleteUser('operator01')).rejects.toThrow('AccessDenied');
    });
  });

  describe('API keys', () => {
    const buildApiKeySecretString = (
      overrides: Partial<{ name: string; expiresAt: string; role: string }> = {}
    ) =>
      JSON.stringify({
        name: 'test-key',
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        role: 'admin',
        ...overrides,
      });

    it('should return the stored role for an API key that has one', async () => {
      const smMockClient = mockClient(SecretsManagerClient);
      smMockClient.on(GetSecretValueCommand).resolves({
        SecretString: buildApiKeySecretString({ role: 'admin' }),
      });

      const result = await service.getApiKey('test');
      expect(result.role).toEqual('admin');
    });

    it('should default the role to messaging for an API key with no stored role', async () => {
      const smMockClient = mockClient(SecretsManagerClient);
      const secret = JSON.parse(buildApiKeySecretString());
      delete secret.role;

      smMockClient.on(GetSecretValueCommand).resolves({
        SecretString: JSON.stringify(secret),
      });

      const result = await service.getApiKey('test');
      expect(result.role).toEqual('messaging');
    });

    it('should return valid: true with the role for a valid, unexpired API key', async () => {
      const smMockClient = mockClient(SecretsManagerClient);
      smMockClient.on(GetSecretValueCommand).resolves({
        SecretString: buildApiKeySecretString({ role: 'messaging' }),
      });

      const result = await service.validateApiKey('test');
      expect(result).toStrictEqual({ valid: true, role: 'messaging' });
    });

    it('should return valid: false for an expired API key', async () => {
      const smMockClient = mockClient(SecretsManagerClient);
      smMockClient.on(GetSecretValueCommand).resolves({
        SecretString: buildApiKeySecretString({
          expiresAt: new Date(Date.now() - 86400000).toISOString(),
        }),
      });

      const result = await service.validateApiKey('test');
      expect(result).toStrictEqual({ valid: false });
    });

    it('should return valid: false for an API key that does not exist', async () => {
      const smMockClient = mockClient(SecretsManagerClient);
      smMockClient
        .on(GetSecretValueCommand)
        .rejects(
          new ResourceNotFoundException({ Message: 'test', message: 'test', $metadata: {} })
        );

      const result = await service.validateApiKey('missing');
      expect(result).toStrictEqual({ valid: false });
    });

    const mockListedApiKeys = (keys: Record<string, { name: string }>) => {
      const smMockClient = mockClient(SecretsManagerClient);
      smMockClient.on(ListSecretsCommand).resolves({
        SecretList: Object.keys(keys).map((apiKey) => ({ Name: `/ddhub/api_key/${apiKey}` })),
      });
      for (const [apiKey, data] of Object.entries(keys)) {
        smMockClient
          .on(GetSecretValueCommand, { SecretId: `/ddhub/api_key/${apiKey}` })
          .resolves({ SecretString: buildApiKeySecretString(data) });
      }
      smMockClient.on(CreateSecretCommand).resolves({});
      smMockClient.on(UpdateSecretCommand).resolves({});
      return smMockClient;
    };

    it('should reject creating an API key with a name already in use', async () => {
      const smMockClient = mockListedApiKeys({ abc123: { name: 'erp' } });

      await expect(service.createApiKey('erp', 30)).rejects.toThrow('API key with name "erp" already exists.');
      expect(smMockClient.commandCalls(CreateSecretCommand)).toHaveLength(0);
    });

    it('should create an API key with a new name', async () => {
      const smMockClient = mockListedApiKeys({ abc123: { name: 'erp' } });

      const created = await service.createApiKey('billing', 30);

      expect(created.name).toBe('billing');
      expect(smMockClient.commandCalls(CreateSecretCommand)).toHaveLength(1);
    });

    it('should reject renaming an API key to a name another key uses', async () => {
      const smMockClient = mockListedApiKeys({ abc123: { name: 'erp' }, def456: { name: 'billing' } });

      await expect(service.updateApiKey('def456', 'erp', 30)).rejects.toThrow('API key with name "erp" already exists.');
      expect(smMockClient.commandCalls(UpdateSecretCommand)).toHaveLength(0);
    });

    it('should let an API key keep its own name on update', async () => {
      const smMockClient = mockListedApiKeys({ abc123: { name: 'erp' } });

      await service.updateApiKey('abc123', 'erp', 30);

      expect(smMockClient.commandCalls(UpdateSecretCommand)).toHaveLength(1);
    });
  });
});
