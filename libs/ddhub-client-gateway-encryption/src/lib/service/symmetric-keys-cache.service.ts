import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { ConfigService } from '@nestjs/config';
import { SymmetricKeysRepositoryWrapper } from '@dsb-client-gateway/dsb-client-gateway-storage';
import {
  DdhubMessagesService,
  SymmetricKeyEntity,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { EnrolmentService } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';
import { IdentityService } from '@dsb-client-gateway/ddhub-client-gateway-identity';

@Injectable()
export class SymmetricKeysCacheService {
  private readonly logger = new Logger(SymmetricKeysCacheService.name);

  constructor(
    protected readonly enrolmentService: EnrolmentService,
    protected readonly iamService: IamService,
    @Inject(forwardRef(() => IdentityService))
    protected readonly identityService: IdentityService,
    protected readonly wrapper: SymmetricKeysRepositoryWrapper,
    protected readonly configService: ConfigService,
    protected readonly ddhubMessagingService: DdhubMessagesService
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

      const enrolment = await this.enrolmentService.get();

      if (!enrolment) {
        this.logger.warn('enrolment is not enabled, skipping cron');

        return;
      }

      const symmetricKeys: SymmetricKeyEntity[] =
        await this.ddhubMessagingService.getSymmetricKeys(
          {
            clientId: this.configService.get('SYMMETRIC_KEY_CLIENT_ID'),
            amount: this.configService.get('AMOUNT_OF_SYMMETRIC_KEYS_FETCHED'),
          },
          {
            retries: 1,
          }
        );

      if (symmetricKeys.length === 0) {
        this.logger.log('No symmetric keys fetched from MB, job not running');
        return;
      }

      for (const symmetricKey of symmetricKeys) {
        await this.wrapper.symmetricKeysRepository
          .save({
            clientGatewayMessageId: symmetricKey.clientGatewayMessageId,
            senderDid: symmetricKey.senderDid,
            payload: symmetricKey.payload,
          })
          .catch((e) => {
            this.logger.error('Failed when saving symmetric key', e);
          });
      }
    } catch (e) {
      this.logger.error('Failed when fetching symmetric keys', e);
    }
  }
}
