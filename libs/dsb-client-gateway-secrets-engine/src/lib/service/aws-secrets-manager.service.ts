import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateSecretCommand,
  GetSecretValueCommand,
  InvalidRequestException,
  PutSecretValueCommand,
  ResourceNotFoundException,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import {
  CertificateDetails,
  EncryptionKeys,
  SecretsEngineService,
} from '../secrets-engine.interface';
import { VaultService } from './vault.service';
import { Span } from 'nestjs-otel';

enum PATHS {
  IDENTITY_PRIVATE_KEY = 'identity/private_key',
  CERTIFICATE = 'certificate/certificate',
  CERTIFICATE_KEY = 'certificate/private_key',
  CA_CERTIFICATE = 'certificate/ca_certificate',
  KEYS = 'keys',
  RSA_KEY = 'rsa_key',
}

@Injectable()
export class AwsSecretsManagerService
  extends SecretsEngineService
  implements OnModuleInit
{
  private readonly logger = new Logger(VaultService.name);

  protected client: SecretsManagerClient;
  protected readonly prefix: string;

  constructor(protected readonly configService: ConfigService) {
    super();
    this.prefix = this.configService.get('AWS_SECRET_PREFIX', '/dsb-gw/');
  }

  @Span('aws_ssm_onModuleInit')
  public async onModuleInit(): Promise<void> {
    const region = this.configService.get('AWS_REGION', 'us-east-1');

    this.client = new SecretsManagerClient({
      region,
    });

    this.logger.log('AWS SSM Service initialized');
  }

  @Span('aws_ssm_setRSAKey')
  public async setRSAPrivateKey(privateKey: string): Promise<void> {
    const command = new PutSecretValueCommand({
      SecretId: `${this.prefix}${PATHS.RSA_KEY}`,
      SecretString: privateKey,
    });

    return this.client
      .send(command)
      .then((response) => {
        this.logger.log(response);
        return;
      })
      .catch((err) => {
        if (err instanceof ResourceNotFoundException) {
          this.logger.log('RSA key secret not found, creating...');
          const createCommand = new CreateSecretCommand({
            Name: `${this.prefix}${PATHS.RSA_KEY}`,
            SecretString: privateKey,
          });
          return this.client
            .send(createCommand)
            .then((response) => this.logger.log(response));
        } else if (err instanceof InvalidRequestException) {
          this.logger.error(err.message);
          // Secret has been deleted...do something?
        } else {
          this.logger.error(err.message);
        }
        return;
      });
  }

  @Span('aws_ssm_getRSAKey')
  public async getRSAPrivateKey(): Promise<string | null> {
    const command = new GetSecretValueCommand({
      SecretId: `${this.prefix}${PATHS.RSA_KEY}`,
    });

    return this.client
      .send(command)
      .then(({ SecretString }) => SecretString)
      .catch((err) => {
        this.logger.error(err.message);
        return null;
      });
  }

  @Span('aws_ssm_setCertificateDetails')
  public async setCertificateDetails({
    caCertificate,
    certificate,
    privateKey,
  }: CertificateDetails): Promise<void> {
    const commands: PutSecretValueCommand[] = [
      new PutSecretValueCommand({
        SecretId: `${this.prefix}${PATHS.CERTIFICATE_KEY}`,
        SecretString: privateKey,
      }),
      new PutSecretValueCommand({
        SecretId: `${this.prefix}${PATHS.CERTIFICATE}`,
        SecretString: certificate,
      }),
    ];

    if (caCertificate) {
      commands.push(
        new PutSecretValueCommand({
          SecretId: `${this.prefix}${PATHS.CERTIFICATE}`,
          SecretString: caCertificate,
        })
      );
    }

    const responses = await Promise.allSettled(
      commands.map((command) => this.client.send(command))
    );

    const errors = responses.filter(
      ({ status }) => status === 'rejected'
    ) as PromiseRejectedResult[];
    if (errors.length > 0) {
      this.logger.error(errors.map(({ reason }) => reason.message).join(', '));
    }
  }

  @Span('aws_ssm_getCertificateDetails')
  public async getCertificateDetails(): Promise<CertificateDetails | null> {
    const [privateKeyCommand, certificateCommand, caCertificateCommand] = [
      new GetSecretValueCommand({
        SecretId: `${this.prefix}${PATHS.CERTIFICATE_KEY}`,
      }),
      new GetSecretValueCommand({
        SecretId: `${this.prefix}${PATHS.CERTIFICATE}`,
      }),
      new GetSecretValueCommand({
        SecretId: `${this.prefix}${PATHS.CA_CERTIFICATE}`,
      }),
    ];

    const responses = await Promise.allSettled([
      this.client.send(privateKeyCommand),
      this.client.send(certificateCommand),
      this.client.send(caCertificateCommand),
    ]);

    const errors = responses.filter(
      ({ status }) => status === 'rejected'
    ) as PromiseRejectedResult[];
    if (errors.length > 0) {
      this.logger.error(errors.map(({ reason }) => reason.message).join(', '));
    }

    const [privateKey, certificate, caCertificate] = responses;

    return {
      privateKey:
        privateKey.status === 'fulfilled'
          ? privateKey.value.SecretString
          : null,
      certificate:
        certificate.status === 'fulfilled'
          ? certificate.value.SecretString
          : null,
      caCertificate:
        caCertificate.status === 'fulfilled'
          ? caCertificate.value.SecretString
          : null,
    };
  }

  @Span('aws_ssm_setPrivateKey')
  public async setPrivateKey(key: string): Promise<void> {
    const putCommand = new PutSecretValueCommand({
      SecretId: `${this.prefix}${PATHS.IDENTITY_PRIVATE_KEY}`,
      SecretString: key,
    });

    return this.client
      .send(putCommand)
      .then((response) => {
        this.logger.log(response);
        return;
      })
      .catch(async (err) => {
        if (err instanceof ResourceNotFoundException) {
          this.logger.log('Private key secret not found, creating...');
          const createCommand = new CreateSecretCommand({
            Name: `${this.prefix}${PATHS.IDENTITY_PRIVATE_KEY}`,
            SecretString: key,
          });
          return this.client
            .send(createCommand)
            .then((response) => this.logger.log(response));
        } else if (err instanceof InvalidRequestException) {
          this.logger.error(err.message);
          // Secret has been deleted...do something?
        } else {
          this.logger.error(err.message);
        }
        return;
      });
  }

  @Span('aws_ssm_getPrivateKey')
  public async getPrivateKey(): Promise<string | null> {
    const command = new GetSecretValueCommand({
      SecretId: `${this.prefix}${PATHS.IDENTITY_PRIVATE_KEY}`,
    });

    return this.client
      .send(command)
      .then(({ SecretString }) => {
        if (!SecretString || SecretString === '' || SecretString === '""') {
          throw new Error('Secret does not contain valid value');
        }
        return SecretString;
      })
      .catch((err) => {
        this.logger.error(err.message);
        return null;
      });
  }

  @Span('aws_ssm_setEncryptionKeys')
  async setEncryptionKeys(keys: EncryptionKeys): Promise<void> {
    const command = new PutSecretValueCommand({
      SecretId: `${this.prefix}${PATHS.KEYS}`,
      SecretString: JSON.stringify(keys),
    });

    return this.client
      .send(command)
      .then((response) => {
        this.logger.log(response);
        return;
      })
      .catch((err) => {
        if (err instanceof ResourceNotFoundException) {
          this.logger.log('Encryption keys secret not found, creating...');
          const createCommand = new CreateSecretCommand({
            Name: `${this.prefix}${PATHS.KEYS}`,
            SecretString: JSON.stringify(keys),
          });
          return this.client
            .send(createCommand)
            .then((response) => this.logger.log(response));
        } else if (err instanceof InvalidRequestException) {
          this.logger.error(err.message);
          // Secret has been deleted...do something?
        } else {
          this.logger.error(err.message);
        }
        return;
      });
  }

  @Span('aws_ssm_getEncryptionKeys')
  async getEncryptionKeys(): Promise<EncryptionKeys | null> {
    const command = new GetSecretValueCommand({
      SecretId: `${this.prefix}${PATHS.KEYS}`,
    });

    return this.client
      .send(command)
      .then(({ SecretString }) => JSON.parse(SecretString))
      .catch((err) => {
        this.logger.error(err.message);
        return null;
      });
  }
}
