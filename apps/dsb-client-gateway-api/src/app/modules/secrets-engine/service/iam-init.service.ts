import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IamService } from '../../iam-service/service/iam.service';
import { SecretsEngineService } from '../secrets-engine.interface';
import { EnrolmentRepository } from '../../storage/repository/enrolment.repository';
import { IdentityRepository } from '../../storage/repository/identity.repository';

@Injectable()
export class IamInitService implements OnModuleInit {
  private readonly logger = new Logger(IamInitService.name);

  constructor(
    protected readonly iamService: IamService,
    protected readonly secretsEngine: SecretsEngineService,
    protected readonly enrolmentRepository: EnrolmentRepository,
    protected readonly identityRepository: IdentityRepository
  ) {}

  public async onModuleInit(): Promise<void> {
    const privateKey = await this.secretsEngine.getPrivateKey();

    if (!privateKey) {
      await this.enrolmentRepository.removeEnrolment();
      await this.identityRepository.removeIdentity();

      return;
    }

    this.logger.log('Initializing IAM using stored private key');

    await this.iamService.setup(privateKey);
  }
}
