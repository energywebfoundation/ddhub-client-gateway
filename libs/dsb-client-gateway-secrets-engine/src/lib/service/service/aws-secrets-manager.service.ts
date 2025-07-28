import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateSecretCommand,
  CreateSecretCommandOutput,
  CreateSecretResponse,
  DeleteSecretCommand,
  GetSecretValueCommand,
  InvalidRequestException,
  ListSecretsCommand,
  PutSecretValueCommand,
  PutSecretValueCommandOutput,
  PutSecretValueResponse,
  ResourceNotFoundException,
  SecretListEntry,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import {
  ApiKeyDetails,
  CertificateDetails,
  PATHS,
  SecretsEngineService,
  UserDetails,
  UserRole,
  UsersList,
} from '../../secrets-engine.interface';
import { Span } from 'nestjs-otel';

@Injectable()
export class AwsSecretsManagerService
  extends SecretsEngineService
  implements OnModuleInit {
  private readonly logger = new Logger(AwsSecretsManagerService.name);

  protected client: SecretsManagerClient;
  protected readonly prefix: string;

  constructor(protected readonly configService: ConfigService) {
    super();
    this.prefix = this.configService.get('SECRET_PREFIX', '/ddhub/');
  }

  @Span('aws_ssm_getMnemonic')
  getMnemonic(): Promise<string | null> {
    return Promise.resolve(undefined);
  }

  @Span('aws_ssm_setMnemonic')
  setMnemonic(_mnemonic: string): Promise<string> {
    return Promise.resolve('');
  }

  @Span('aws_ssm_onModuleInit')
  public async onModuleInit(): Promise<void> {
    const region = this.configService.get('AWS_REGION', 'ap-southeast-2');

    this.client = new SecretsManagerClient({
      region,
    });

    this.logger.log('AWS SSM Service initialized');
  }

  @Span('aws_ssm_getAllUsers')
  public async getAllUsers(): Promise<UsersList> {
    throw new Error('User Auth is not implemented in AWS Secrets Engine');
  }

  @Span('aws_ssm_getUserAuthDetails')
  public async getUserAuthDetails(username: string
  ): Promise<UserDetails | null> {
    const command = new GetSecretValueCommand({
      SecretId: username
    });

    try {
      const response = await this.client.send(command);

      if (response.SecretString) {
        const data = JSON.parse(response.SecretString);
        const userDetails = {
          username,
          ...data
        };
        this.logger.log(`User details for ${username}:`, userDetails);
        return userDetails;
      }
    } catch (error) {
      throw new Error(`No SecretString found for ${username}`);
    }

  }

  @Span('aws_ssm_setUserPassword')
  public async setUserPassword(
    username: string,
    password: string
  ): Promise<void> {
    const name = `${this.prefix}${PATHS.USERS}/${username}`;
    const data = JSON.stringify({ password, role: UserRole.ADMIN });
    const command = new PutSecretValueCommand({
      SecretId: name,
      SecretString: data,
    });

    this.client
      .send(command)
      .then((response) => {
        this.logger.log(`Successfully updated password: ${name}`);
        return response;
      })
      .catch((err) => this.handlePutSecretValueError(err, name, data));
  }

  @Span('aws_ssm_setRSAKey')
  public async setRSAPrivateKey(
    privateKey: string
  ): Promise<CreateSecretResponse | PutSecretValueResponse | null> {
    const name = `${this.prefix}${PATHS.RSA_KEY}`;
    const command = new PutSecretValueCommand({
      SecretId: name,
      SecretString: privateKey,
    });

    return this.client
      .send(command)
      .then((response) => {
        this.logger.log(`Successfully set RSA private key: ${name}`);
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
  }: CertificateDetails): Promise<
    CreateSecretResponse[] | PutSecretValueResponse[]
  > {
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
  public async setPrivateKey(
    key: string
  ): Promise<CreateSecretResponse | PutSecretValueResponse | null> {
    const name = `${this.prefix}${PATHS.IDENTITY_PRIVATE_KEY}`;
    const putCommand = new PutSecretValueCommand({
      SecretId: name,
      SecretString: key,
    });

    return this.client
      .send(putCommand)
      .then((response) => {
        this.logger.log(`Successfully set private identity key: ${name}`);
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
        this.logger.log(`Successfully created secret: ${name}`);
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

  @Span('aws_ssm_setUserPassword')
  public async delateUser(username: string): Promise<void> {
    const name = `${this.prefix}${PATHS.USERS}/${username}`;

    const command = new DeleteSecretCommand({
      SecretId: name
    });

    this.client
      .send(command)
      .then((response) => {
        this.logger.log(`Successfully delete user: ${name}`);
        return response;
      })
      .catch((err) => {
        this.logger.error(err.message);
        return null;
      });
  }

  @Span('aws_ssm_createApiKey')
  public async createApiKey(name: string, daysValid: number): Promise<ApiKeyDetails> {
    this.logger.log(`Attempting to create api key `);

    const apiKey = this.generateRandomKey();
    const expiresAt = new Date(Date.now() + daysValid * this.MS_PER_DAY);

    const data = {
      name,
      expiresAt: expiresAt.toISOString(),
    };

    await this.client.send(new CreateSecretCommand({
      Name: `${this.prefix}${PATHS.API_KEY}/${apiKey}`,
      SecretString: JSON.stringify(data)
    }));

    this.logger.log(`create api key ${apiKey}`);
    return { apiKey, name, expiresAt: expiresAt.toISOString() };
  }

  @Span('aws_ssm_deleteApiKey')
  public async deleteApiKey(apiKey: string): Promise<boolean> {
    try {
      this.logger.log(`Attempting to delete api key `);

      const name = `${this.prefix}${PATHS.API_KEY}/${apiKey}`;

      const command = new DeleteSecretCommand({
        SecretId: name
      });

      await this.client.send(command);

      this.logger.log(`Delete api key ${apiKey}`);
      return true;
    } catch (error) {
      this.logger.error('failed to delete api key');
      this.logger.error(error);
      return false;
    }
  }

  @Span('aws_ssm_getApiKey')
  public async getApiKey(apiKey: string): Promise<ApiKeyDetails> {
    try {
      this.logger.log(`Attempting to get api key `);

      const command = new GetSecretValueCommand({
        SecretId: `${this.prefix}${PATHS.USERS}/${apiKey}`,
      });
      const response = await this.client.send(command);

      if (response.SecretString) {
        const result = JSON.parse(response.SecretString);
        this.logger.log(`Get api key ${apiKey}`);
        return { ...result };
      }
    } catch (error) {
      this.logger.error('failed to get api key');
      this.logger.error(error);
      return null;
    }
  }

  @Span('aws_ssm_getAllApiKeys')
  public async getAllApiKeys(): Promise<ApiKeyDetails[]> {
    const apiKeySecretIdentifiers: string[] = [];
    let nextToken: string | undefined = undefined;

    do {
      const { SecretList = [], NextToken } = await this.client.send(
        new ListSecretsCommand({
          NextToken: nextToken,
          Filters: [
            { Key: "name", Values: [`${this.prefix}${PATHS.API_KEY}`] }
          ]
        })
      );
      nextToken = NextToken;

      for (const secret of SecretList as SecretListEntry[]) {
        apiKeySecretIdentifiers.push(secret.Name);
      }
    } while (nextToken);

    const apiKeyListResponse = await Promise.allSettled(
      apiKeySecretIdentifiers.map((name) => {
        const apiKey = name.replace(`${this.prefix}/`, "");
        return this.getApiKey(apiKey);
      })
    );

    return apiKeyListResponse
      .filter(
        (res): res is PromiseFulfilledResult<ApiKeyDetails | null> => res.status === 'fulfilled'
      )
      .map(res => res.value)
      .filter(item => item !== null);
  }

  @Span('aws_ssm_validateApiKey')
  public async validateApiKey(apiKey: string): Promise<boolean> {
    const result = await this.getApiKey(apiKey);
    if (!result) return false;
    if (new Date() > new Date(result.expiresAt)) return false;
    return true;
  }
}
