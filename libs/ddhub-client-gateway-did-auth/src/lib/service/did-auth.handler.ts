import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DidAuthCommand } from '../command/did-auth.command';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { LoginCommand } from '../command/login.command';

@CommandHandler(DidAuthCommand)
export class DidAuthHandler implements ICommandHandler<DidAuthCommand> {
  constructor(
    protected readonly iamService: IamService,
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly commandBus: CommandBus
  ) {}

  public async execute(): Promise<void> {
    const didAddress: string = this.iamService.getDIDAddress();
    const privateKey: string | null =
      await this.secretsEngineService.getPrivateKey();

    await this.commandBus.execute(new LoginCommand(privateKey, didAddress));
  }
}
