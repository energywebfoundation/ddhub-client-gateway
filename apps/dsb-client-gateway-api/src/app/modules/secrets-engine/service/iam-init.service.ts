import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IamService } from '../../iam-service/service/iam.service';
import { SecretsEngineService } from '../secrets-engine.interface';

@Injectable()
export class IamInitService implements OnModuleInit {
  private readonly logger = new Logger(IamInitService.name);

  constructor(
    protected readonly iamService: IamService,
    protected readonly secretsEngine: SecretsEngineService
  ) {
  }

  public async onModuleInit(): Promise<void> {
    const privateKey = await this.secretsEngine.getPrivateKey();

    if (!privateKey) {
      return;
    }

    this.logger.log('Initializing IAM using stored private key');

    await this.iamService.setup(privateKey);
  }
}
