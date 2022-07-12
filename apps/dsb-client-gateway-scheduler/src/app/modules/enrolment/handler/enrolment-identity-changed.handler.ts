import { EnrolmentIdentityChangedCommand } from '@dsb-client-gateway/ddhub-client-gateway-events';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EnrolmentListenerService } from '../service/enrolment-listener.service';

@CommandHandler(EnrolmentIdentityChangedCommand)
export class EnrolmentIdentityChangedHandler
  implements ICommandHandler<EnrolmentIdentityChangedCommand>
{
  protected readonly logger = new Logger(EnrolmentIdentityChangedHandler.name);

  constructor(
    protected readonly enrolmentTriggerService: EnrolmentListenerService
  ) {}

  public async execute(): Promise<void> {
    await this.enrolmentTriggerService.listen();
  }
}
