import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';

@Injectable()
export class AppInitService implements OnModuleInit {
  protected readonly logger = new Logger(AppInitService.name);

  constructor(
    protected readonly iamService: IamService,
    protected readonly secretsEngineService: SecretsEngineService
  ) {}

  public async onModuleInit(): Promise<void> {
    const privateKey: string | null =
      await this.secretsEngineService.getPrivateKey();

    if (!privateKey) {
      this.logger.error('No private key is set');

      return;
    }

    this.logger.log('Initializing IAM');
    await this.iamService.setup(privateKey);
  }
}
