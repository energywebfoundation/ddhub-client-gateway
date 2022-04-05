import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DidAttributeChangedCommand } from '@dsb-client-gateway/dsb-client-gateway-did-registry';
import { DidRepository } from '@dsb-client-gateway/dsb-client-gateway-storage';
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
