import { Injectable, Logger } from '@nestjs/common';
import {
  ReqLockEntity,
  ReqLockWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ReqLockExistsException } from '../exceptions/req-lock-exists.exception';
import moment from 'moment';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReqLockService {
  protected readonly logger = new Logger(ReqLockService.name);

  constructor(
    protected readonly reqLockWrapper: ReqLockWrapperRepository,
    protected readonly configService: ConfigService
  ) {}

  public async clearLock(clientId: string, fqcn: string): Promise<void> {
    await this.reqLockWrapper.repository.delete({
      fqcn,
      clientId,
    });

    this.logger.log(`lock with ${fqcn}:${clientId} removed`);
  }

  public async attemptLock(clientId: string, fqcn: string): Promise<void> {
    try {
      const existingLock: ReqLockEntity | undefined =
        await this.reqLockWrapper.repository.findOne({
          where: {
            clientId,
            fqcn,
          },
        });

      if (!existingLock) {
        await this.reqLockWrapper.repository.insert({
          fqcn,
          clientId,
        });

        this.logger.log(`lock with ${fqcn}:${clientId} saved`);

        return;
      }

      if (
        moment(existingLock.updatedDate)
          .add(this.configService.get<number>('REQ_LOCK_TIMEOUT'), 'seconds')
          .isSameOrBefore(moment())
      ) {
        this.logger.log(`outdated lock`, {
          fqcn,
          clientId,
        });

        await this.reqLockWrapper.repository.delete({
          fqcn,
          clientId,
        });
      }

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
