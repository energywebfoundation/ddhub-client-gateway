import {
  CreateSecretCommand,
  GetSecretValueCommand,
  PutSecretValueCommand,
  ResourceNotFoundException,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { ConfigService } from '@nestjs/config';
import { AwsSecretsManagerService } from './aws-secrets-manager.service';
import { mockClient } from 'aws-sdk-client-mock';

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
        new ResourceNotFoundException({ Message: 'test', $metadata: {} }),
      );

    const key = await service.getRSAPrivateKey();
    expect(key).toBeNull();
  });

  it('should create an RSA Private Key if it does not exist', async () => {
    const smMockClient = mockClient(SecretsManagerClient);

    smMockClient
      .on(PutSecretValueCommand)
      .rejects(
        new ResourceNotFoundException({ Message: 'test', $metadata: {} }),
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
        $metadata: {},
      }),
    );

    const key = await service.getPrivateKey();
    expect(key).toBeNull();
  });

  it('should create a Private Identity Key if it does not exist', async () => {
    const smMockClient = mockClient(SecretsManagerClient);

    smMockClient
      .on(PutSecretValueCommand)
      .rejects(
        new ResourceNotFoundException({ Message: 'test', $metadata: {} }),
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
        new ResourceNotFoundException({ Message: 'test', $metadata: {} }),
      )
      .rejectsOnce(
        new ResourceNotFoundException({ Message: 'test', $metadata: {} }),
      )
      .rejectsOnce(
        new ResourceNotFoundException({ Message: 'test', $metadata: {} }),
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
        new ResourceNotFoundException({ Message: 'test', $metadata: {} }),
      )
      .rejectsOnce(
        new ResourceNotFoundException({ Message: 'test', $metadata: {} }),
      )
      .rejectsOnce(
        new ResourceNotFoundException({ Message: 'test', $metadata: {} }),
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
});
