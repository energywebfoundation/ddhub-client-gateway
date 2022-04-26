import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { Span } from 'nestjs-otel';
import { EnrolmentService } from '../../enrolment/service/enrolment.service';
import { IdentityService } from './identity.service';

@Injectable()
export class IamInitService implements OnModuleInit {
  private readonly logger = new Logger(IamInitService.name);

  constructor(
    protected readonly iamService: IamService,
    protected readonly secretsEngine: SecretsEngineService,
    protected readonly enrolmentService: EnrolmentService,
    protected readonly identityService: IdentityService
  ) {}

  @Span('iam_initializer')
  public async onModuleInit(): Promise<void> {
    const privateKey = await this.secretsEngine.getPrivateKey();

    if (!privateKey) {
      await this.enrolmentService.deleteEnrolment();
      await this.identityService.removeIdentity();

      return;
    }

    this.logger.log('Initializing IAM using stored private key');

    await this.iamService.setup(privateKey);
  }
}
