import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateSecretCommand,
  CreateSecretCommandOutput,
  CreateSecretResponse,
  DeleteSecretCommand,
  DescribeSecretCommand,
  GetSecretValueCommand,
  InvalidRequestException,
  ListSecretsCommand,
  PutSecretValueCommand,
  PutSecretValueCommandOutput,
  PutSecretValueResponse,
  ResourceNotFoundException,
  SecretListEntry,
  SecretsManagerClient,
  UpdateSecretCommand,
} from '@aws-sdk/client-secrets-manager';
import {
  ApiKeyDetails,
  ApiKeyValidationResult,
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
  public async getMnemonic(): Promise<string | null> {
    const secretName = `${this.prefix}${PATHS.MNEMONIC}`;
    
    try {
      const command = new GetSecretValueCommand({ 
        SecretId: secretName 
      });
      const response = await this.client.send(command);
      
      return response.SecretString ?? null;
    } catch (err: any) {
      if (err.name === 'ResourceNotFoundException' || err instanceof ResourceNotFoundException) {
        this.logger.log(`Mnemonic secret not found at ${secretName}.`);
        return null;
      }
      this.logger.error(`Error retrieving mnemonic: ${err.message}`);
      throw err;
    }
  }

  @Span('aws_ssm_setMnemonic')
  public async setMnemonic(mnemonic: string): Promise<string> {
    const name = `${this.prefix}${PATHS.MNEMONIC}`;
    
    try {
      const command = new PutSecretValueCommand({
        SecretId: name,
        SecretString: mnemonic,
      });
      
      await this.client.send(command);
      this.logger.log(`Successfully updated mnemonic: ${name}`);
      
      return mnemonic;
    } catch (err: any) {
      // Falls back to creating the secret if it doesn't exist yet
      await this.handlePutSecretValueError(err, name, mnemonic);
      return mnemonic;
    }
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
    const userPrefix = `${this.prefix}${PATHS.USERS}/`;
    const userSecretIdentifiers: string[] = [];
    let nextToken: string | undefined = undefined;

    // 1. Fetch all secret IDs matching the user prefix
    do {
      const command = new ListSecretsCommand({
        Filters: [{ Key: 'name', Values: [userPrefix] }],
        NextToken: nextToken,
      });

      const response = await this.client.send(command);
      if (response.SecretList) {
        response.SecretList.forEach((secret) => {
          if (secret.Name) userSecretIdentifiers.push(secret.Name);
        });
      }
      nextToken = response.NextToken;
    } while (nextToken);

    this.logger.log(`Found ${userSecretIdentifiers.length} secrets matching prefix ${userPrefix}`);

    // 2. Fetch and parse each secret's value
    const userListResponse = await Promise.allSettled(
      userSecretIdentifiers.map(async (secretName) => {
        try {
          const getCommand = new GetSecretValueCommand({ SecretId: secretName });
          const { SecretString } = await this.client.send(getCommand);

          if (!SecretString) throw new Error(`Empty secret string for ${secretName}`);

          const parsedData = JSON.parse(SecretString); // Contains { password, role } [4]
          const username = secretName.replace(userPrefix, '');

          return {
            username,
            password: parsedData.password,
            role: parsedData.role,
          } as UserDetails;
        } catch (error) {
          this.logger.error(`Failed to retrieve or parse secret ${secretName}:`, error);
          throw error;
        }
      })
    );

    // 3. Return the successfully retrieved users
    const successfulUsers = userListResponse
      .filter((res): res is PromiseFulfilledResult<UserDetails> => res.status === 'fulfilled')
      .map(({ value }) => value);

    if (successfulUsers.length === 0 && userSecretIdentifiers.length > 0) {
       this.logger.warn(`All ${userSecretIdentifiers.length} secrets failed during GetSecretValueCommand or JSON parsing.`);
    }

    return successfulUsers;
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

  @Span('aws_ssm_userExists')
  public async userExists(username: string): Promise<boolean> {
    const name = `${this.prefix}${PATHS.USERS}/${username}`;

    try {
      await this.client.send(new DescribeSecretCommand({ SecretId: name }));
      // If DescribeSecret succeeds, the secret already exists
      return true;
    } catch (err) {
      // ResourceNotFoundException means the secret does not exist
      if (err.name === 'ResourceNotFoundException') {
        return false;
      }
      // any other error should be rethrown
      throw err;
    }
  }

  @Span('aws_ssm_setUserPassword')
  public async setUserPassword(
    username: string,
    password: string,
    role: UserRole
  ): Promise<void> {
    const name = `${this.prefix}${PATHS.USERS}/${username}`;
    const data = JSON.stringify({ password, role });
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
    const secretIdentifiers: string[] = [];
    let nextToken: string | undefined = undefined;

    // 1. Fetch all secret IDs matching the root prefix
    do {
      const command = new ListSecretsCommand({
        Filters: [{ Key: 'name', Values: [this.prefix] }],
        NextToken: nextToken,
      });

      const response = await this.client.send(command);
      if (response.SecretList) {
        response.SecretList.forEach((secret) => {
          if (secret.Name) secretIdentifiers.push(secret.Name);
        });
      }
      nextToken = response.NextToken;
    } while (nextToken);

    // 2. Issue a delete command for each secret
    if (secretIdentifiers.length > 0) {
      await Promise.allSettled(
        secretIdentifiers.map(async (secretName) => {
          const deleteCommand = new DeleteSecretCommand({
            SecretId: secretName,
            ForceDeleteWithoutRecovery: true, // Bypass recovery window to fully delete
          });
          return this.client.send(deleteCommand);
        })
      );
      this.logger.log(`Successfully scheduled ${secretIdentifiers.length} secrets for deletion.`);
    } else {
      this.logger.log('No secrets found to delete.');
    }
  }

  @Span('aws_ssm_setUserPassword')
  public async deleteUser(username: string): Promise<void> {
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
  public async createApiKey(name: string, daysValid: number, role: string = UserRole.MESSAGING): Promise<ApiKeyDetails> {
    this.logger.log(`Attempting to create api key `);

    const apiKey = this.generateRandomKey();
    const expiresAt = new Date(Date.now() + daysValid * this.MS_PER_DAY);

    const data = {
      name,
      expiresAt: expiresAt.toISOString(),
      role,
    };

    await this.client.send(new CreateSecretCommand({
      Name: `${this.prefix}${PATHS.API_KEY}/${apiKey}`,
      SecretString: JSON.stringify(data)
    }));

    this.logger.log(`create api key ${apiKey}`);
    return { apiKey, name, expiresAt: expiresAt.toISOString(), role };
  }

  @Span('aws_ssm_updateApiKey')
  public async updateApiKey(apiKey: string, name: string, daysValid: number, role?: string): Promise<ApiKeyDetails> {
    this.logger.log(`Attempting to update api key ${apiKey}`);

    const secretName = `${this.prefix}${PATHS.API_KEY}/${apiKey}`;

    // Lookup the existing secret to ensure an API key with that id exists
    const existingSecret = await this.client.send(
      new GetSecretValueCommand({ SecretId: secretName })
    ).catch(() => null);

    if (!existingSecret || !existingSecret.SecretString) {
      throw new Error(`API key "${apiKey}" not found.`);
    }

    const expiresAt = new Date(Date.now() + daysValid * this.MS_PER_DAY).toISOString();
    const existingData = JSON.parse(existingSecret.SecretString);
    const resolvedRole = role ?? existingData.role ?? UserRole.MESSAGING;
    const updatedSecret = JSON.stringify({ name, expiresAt, role: resolvedRole });

    // Update the secret with new name & expiration
    await this.client.send(
      new UpdateSecretCommand({
        SecretId: secretName,
        SecretString: updatedSecret,
      }),
    );

    this.logger.log(`updated api key ${apiKey}`);
    return { apiKey, name, expiresAt, role: resolvedRole };
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
        SecretId: `${this.prefix}${PATHS.API_KEY}/${apiKey}`,
      });
      const response = await this.client.send(command);

      if (response.SecretString) {
        const result = JSON.parse(response.SecretString);
        this.logger.log(`Get api key ${apiKey}`);
        return { apiKey, ...result, role: result.role ?? UserRole.MESSAGING };
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
    const apiKeyPrefix = `${this.prefix}${PATHS.API_KEY}/`;

    do {
      const { SecretList = [], NextToken } = await this.client.send(
        new ListSecretsCommand({
          NextToken: nextToken,
          Filters: [
            { Key: "name", Values: [apiKeyPrefix] }
          ]
        })
      );
      nextToken = NextToken;

      for (const secret of SecretList as SecretListEntry[]) {
        if (secret.Name) {
          apiKeySecretIdentifiers.push(secret.Name);
        }
      }
    } while (nextToken);

    const apiKeyListResponse = await Promise.allSettled(
      apiKeySecretIdentifiers.map((name) => {
        const apiKey = name.replace(apiKeyPrefix, "");
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
  public async validateApiKey(apiKey: string): Promise<ApiKeyValidationResult> {
    const result = await this.getApiKey(apiKey);
    if (!result) return { valid: false };
    if (new Date() > new Date(result.expiresAt)) return { valid: false };
    return { valid: true, role: result.role };
  }
}
