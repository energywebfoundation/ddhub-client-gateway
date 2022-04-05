import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DidAttributeChangedCommand } from '../../../../../../../libs/dsb-client-gateway-did-registry/src/lib/command/did-attribute-changed.command';
import { DidRepository } from '../../../../../../../libs/dsb-client-gateway-storage/src/lib/repository/did.repository';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';

@CommandHandler(DidAttributeChangedCommand)
export class DidAttributeChangedHandler
  implements ICommandHandler<DidAttributeChangedCommand>
{
  constructor(
    protected readonly didRepository: DidRepository,
    protected readonly iamService: IamService
  ) {}

  public async execute({ did }: DidAttributeChangedCommand): Promise<any> {}
}
