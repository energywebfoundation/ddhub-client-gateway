import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CertificateChangedCommand } from '../command';
import { TlsAgentService } from '../service';

@CommandHandler(CertificateChangedCommand)
export class CertificateChangedHandler
  implements ICommandHandler<CertificateChangedCommand>
{
  constructor(protected readonly tlsAgentService: TlsAgentService) {}

  public async execute(): Promise<void> {
    await this.tlsAgentService.create();
  }
}
