import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IamService } from '../../iam-service/service/iam.service';
import { SecretsEngineService } from '../secrets-engine.interface';
import { StorageService } from '../../storage/service/storage.service';

@Injectable()
export class IamInitService implements OnModuleInit {
  private readonly logger = new Logger(IamInitService.name);

  constructor(
    protected readonly iamService: IamService,
    protected readonly secretsEngine: SecretsEngineService,
    protected readonly storageService: StorageService
  ) {}

  public async onModuleInit(): Promise<void> {
    const privateKey = await this.secretsEngine.getPrivateKey();

    if (!privateKey) {
      await this.storageService.removeEnrolment();
      await this.storageService.removeIdentity();

      return;
    }

    this.logger.log('Initializing IAM using stored private key');

    await this.iamService.setup(privateKey);
  }
}
