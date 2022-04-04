import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DidAttributeChangedCommand } from '../../../../../../../libs/dsb-client-gateway-did-registry/src/lib/command/did-attribute-changed.command';

@CommandHandler(DidAttributeChangedCommand)
export class DidAttributeChangedHandler
  implements ICommandHandler<DidAttributeChangedCommand>
{
  public async execute({ did }: DidAttributeChangedCommand): Promise<any> {
    console.log(did);
  }
}
