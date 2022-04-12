import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';

@Injectable()
export class IamInitService implements OnModuleInit {
  private readonly logger = new Logger(IamInitService.name);

  constructor(
    protected readonly iamService: IamService,
    protected readonly secretsEngine: SecretsEngineService
  ) {}

  public async onModuleInit(): Promise<void> {
    this.logger.log('Attempting to init IAM using stored private key');

    const privateKey = await this.secretsEngine.getPrivateKey();

    this.logger.log('Initializing IAM using stored private key');

    await this.iamService.setup(privateKey);
  }
}
