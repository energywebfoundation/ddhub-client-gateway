import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { EnrolmentService } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';
import promiseRetry from 'promise-retry';

@Injectable()
export class EnrolmentListenerService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(EnrolmentListenerService.name);

  constructor(protected readonly enrolmentService: EnrolmentService) {}

  public async onApplicationBootstrap(): Promise<void> {
    await this.listen();
  }

  public async listen(): Promise<void> {
    await promiseRetry(
      async (retry) => {
        await this.enrolmentService.startListening().catch(retry);
      },
      {
        forever: true,
        minTimeout: 1000,
        maxTimeout: 2000,
      }
    );
  }
}
