import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateSecretCommand,
  CreateSecretCommandOutput,
  CreateSecretResponse,
  GetSecretValueCommand,
  InvalidRequestException,
  PutSecretValueCommand,
  PutSecretValueCommandOutput,
  ResourceNotFoundException,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import {
  CertificateDetails,
  PATHS,
  SecretsEngineService,
  SetCertificateDetailsResponse,
  SetPrivateKeyResponse,
  SetRSAPrivateKeyResponse,
} from '../../secrets-engine.interface';
import { Span } from 'nestjs-otel';

@Injectable()
export class AwsSecretsManagerService
  extends SecretsEngineService
  implements OnModuleInit
{
  private readonly logger = new Logger(AwsSecretsManagerService.name);

  protected client: SecretsManagerClient;
  protected readonly prefix: string;

  constructor(protected readonly configService: ConfigService) {
    super();
    this.prefix = this.configService.get('AWS_SECRET_PREFIX', '/ddhub/');
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
  public async setRSAPrivateKey(
    privateKey: string
  ): Promise<SetRSAPrivateKeyResponse> {
    const name = `${this.prefix}${PATHS.RSA_KEY}`;
    const command = new PutSecretValueCommand({
      SecretId: name,
      SecretString: privateKey,
    });

    return this.client
      .send(command)
      .then((response) => {
        this.logger.log(response);
        return response;
      })
      .catch(async (err) => {
        return this.handlePutSecretValueError(err, name, privateKey);
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
  }: CertificateDetails): Promise<SetCertificateDetailsResponse> {
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
          SecretId: `${this.prefix}${PATHS.CA_CERTIFICATE}`,
          SecretString: caCertificate,
        })
      );
    }

    const responses = await Promise.allSettled(
      commands.map((command) =>
        this.client.send(command).catch((err) => {
          throw new Error(
            JSON.stringify({
              SecretId: command.input.SecretId,
              SecretString: command.input.SecretString,
              error: err,
            })
          );
        })
      )
    );

    const errors = responses.filter(
      ({ status }) => status === 'rejected'
    ) as PromiseRejectedResult[];

    if (errors.length === 0) {
      return responses
        .filter(({ status }) => status === 'fulfilled')
        .map((response) =>
          response.status === 'fulfilled' ? response.value : null
        ) as PutSecretValueCommandOutput[];
    }

    // Check if any ResourceNotFoundExceptions occurred, if so, create the missing secrets
    const createCommands = [];
    const unknownErrors = [];

    for (const err of errors) {
      const { SecretId, SecretString, error } = JSON.parse(err.reason.message);
      if (error.name === 'ResourceNotFoundException') {
        this.logger.log(`${SecretId} not found, creating...`);
        createCommands.push(
          new CreateSecretCommand({
            Name: SecretId,
            SecretString,
          })
        );
      } else {
        unknownErrors.push(error);
      }
    }

    const createResponses = await Promise.allSettled(
      createCommands.map((command) =>
        this.client.send(command).then((response) => {
          this.logger.log('Created secret', response);
          return response;
        })
      )
    );
    const createErrors = createResponses.filter(
      ({ status }) => status === 'rejected'
    ) as PromiseRejectedResult[];

    // Return any errors that occurred during secret creation, or any unknown errors that occurred before creation
    if (createErrors.length > 0 || unknownErrors.length > 0) {
      return [...createErrors, ...unknownErrors];
    }
    return createResponses
      .filter(({ status }) => status === 'fulfilled')
      .map((response) =>
        response.status === 'fulfilled' ? response.value : null
      ) as CreateSecretCommandOutput[];
  }

  @Span('aws_ssm_getCertificateDetails')
  public async getCertificateDetails(): Promise<CertificateDetails> {
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
  public async setPrivateKey(key: string): Promise<SetPrivateKeyResponse> {
    const name = `${this.prefix}${PATHS.IDENTITY_PRIVATE_KEY}`;
    const putCommand = new PutSecretValueCommand({
      SecretId: name,
      SecretString: key,
    });

    return this.client
      .send(putCommand)
      .then((response) => {
        this.logger.log(response);
        return response;
      })
      .catch(async (err) => {
        return this.handlePutSecretValueError(err, name, key);
      });
  }

  @Span('aws_ssm_getPrivateKey')
  public async getPrivateKey(): Promise<string | null> {
    if (!this.client) {
      this.logger.warn('AWS client not initialized during getPrivateKey');

      return null;
    }

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

  private async handlePutSecretValueError(
    err: Error,
    name: string,
    value: string
  ): Promise<CreateSecretResponse | null> {
    if (err instanceof ResourceNotFoundException) {
      this.logger.log(`${name} not found, creating...`);
      const createCommand = new CreateSecretCommand({
        Name: name,
        SecretString: value,
      });
      return this.client.send(createCommand).then((response) => {
        this.logger.log('Created secret', response);
        return response;
      });
    } else if (err instanceof InvalidRequestException) {
      this.logger.error(err.message);
      // Secret has been deleted...do something?
    } else {
      this.logger.error(err.message);
    }
    return null;
  }

  @Span('aws_ssm_deleteAll')
  public async deleteAll(): Promise<void> {
    this.logger.log('DeleteAll not implemented in AWS Secrets Engine');
  }
}
