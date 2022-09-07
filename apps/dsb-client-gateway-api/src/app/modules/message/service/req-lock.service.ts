import { Injectable, Logger } from '@nestjs/common';
import { ReqLockWrapperRepository } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ReqLockExistsException } from '../exceptions/req-lock-exists.exception';

@Injectable()
export class ReqLockService {
  protected readonly logger = new Logger(ReqLockService.name);

  constructor(protected readonly reqLockWrapper: ReqLockWrapperRepository) {}

  public async clearLock(clientId: string, fqcn: string): Promise<void> {
    await this.reqLockWrapper.repository.delete({
      fqcn,
      clientId,
    });

    this.logger.log(`lock with ${fqcn}:${clientId} removed`);
  }

  public async attemptLock(clientId: string, fqcn: string): Promise<void> {
    try {
      await this.reqLockWrapper.repository.insert({
        fqcn,
        clientId,
      });

      this.logger.log(`lock with ${fqcn}:${clientId} saved`);
    } catch (e) {
      if (e?.code === '23505') {
        throw new ReqLockExistsException();
      }

      this.logger.error(e);

      throw e;
    }
  }
}
