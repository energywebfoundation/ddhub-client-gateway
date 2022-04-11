import { Injectable, Logger } from '@nestjs/common';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { DsbApiService } from '../../dsb-client/service/dsb-api.service';
import { SymmetricKeyEntity } from '../entity/message.entity';
import { SymmetricKeysRepository } from '../repository/symmetric-keys.repository';
import { ConfigService } from '@nestjs/config';
import { IdentityService } from '../../identity/service/identity.service';
import { EnrolmentRepository } from '../../storage/repository/enrolment.repository';
@Injectable()
export class SymmetricKeysCacheService {
  private readonly logger = new Logger(SymmetricKeysCacheService.name);

  constructor(
    protected readonly enrolmentRepository: EnrolmentRepository,
    protected readonly iamService: IamService,
    protected readonly identityService: IdentityService,
    protected readonly dsbApiService: DsbApiService,
    protected readonly symmetricKeysRepository: SymmetricKeysRepository,
    protected readonly configService: ConfigService
  ) {}

  public async refreshSymmetricKeysCache(): Promise<void> {
    try {
      if (!this.iamService.isInitialized()) {
        this.logger.warn(
          'IAM connection is not initialized, skipping refresh symmetric key cron'
        );

        return;
      }

      const identityReady: boolean = await this.identityService.identityReady();

      if (!identityReady) {
        this.logger.warn(
          'Private key not set, skipping refresh symmetric key cron'
        );

        return;
      }

      const enrolment = this.enrolmentRepository.getEnrolment();

      if (!enrolment) {
        this.logger.warn('enrolment is not enabled, skipping cron');

        return;
      }

      const symmetricKeys: SymmetricKeyEntity[] =
        await this.dsbApiService.getSymmetricKeys(
          {
            clientId: this.configService.get('SYMMETRIC_KEY_CLIENT_ID'),
            amount: this.configService.get('AMOUNT_OF_SYMMETRIC_KEYS_FETCHED'),
          },
          {
            retries: 1,
          }
        );

      this.logger.log('symmetric keys', symmetricKeys);

      if (symmetricKeys.length === 0) {
        this.logger.log('No internal Messages, job not running');
        return;
      }

      for (const symmetricKey of symmetricKeys) {
        await this.symmetricKeysRepository
          .createOrUpdateSymmetricKey(symmetricKey)
          .catch((e) => {
            this.logger.error('Failed when saving symmetric key', e);
          });
      }
    } catch (e) {
      this.logger.error('Failed when fetching symmetric keys', e);
    }
  }
}
