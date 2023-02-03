import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForceAssociationKeysRunCommand } from '../command/force-association-keys-run.command';
import { AssociationKeysListener } from '../service/association-keys.listener';

@CommandHandler(ForceAssociationKeysRunCommand)
export class ForceAssociationKeysRunHandler
  implements ICommandHandler<ForceAssociationKeysRunCommand>
{
  constructor(
    protected readonly associationKeysListener: AssociationKeysListener
  ) {}

  public async execute(): Promise<void> {
    await this.associationKeysListener.execute();
  }
}
