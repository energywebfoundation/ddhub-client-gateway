import { Injectable, Logger } from '@nestjs/common';

import { DsbApiService } from '../../dsb-client/service/dsb-api.service';
import { SymmetricKeyEntity } from '../entity/message.entity';
import { SymmetricKeysRepository } from '../repository/symmetric-keys.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SymmetricKeysCacheService {
  private readonly logger = new Logger(SymmetricKeysCacheService.name);

  constructor(
    protected readonly dsbApiService: DsbApiService,
    protected readonly symmetricKeysRepository: SymmetricKeysRepository,
    protected readonly configService: ConfigService
  ) {}

  public async refreshSymmetricKeysCache(): Promise<void> {
    const symmetricKeys: SymmetricKeyEntity[] =
      await this.dsbApiService.getSymmetricKeys({
        clientId: this.configService.get('SYMMETRIC_KEY_CLIENT_ID'),
        amount: this.configService.get('AMOUNT_OF_SYMMETRIC_KEYS_FETCHED'),
      });

    this.logger.log('internalMesssages', symmetricKeys);

    if (symmetricKeys.length === 0) {
      this.logger.log('No internal Messages, job not running');
      return;
    }

    for (const symmetricKey of symmetricKeys) {
      await this.symmetricKeysRepository.createOrUpdateSymmetricKey(
        symmetricKey
      );
    }
  }
}
