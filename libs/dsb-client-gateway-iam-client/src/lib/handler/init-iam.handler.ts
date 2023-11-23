import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InitIamCommand } from '../command/init-iam.command';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { IamService } from '../service/iam.service';

@CommandHandler(InitIamCommand)
export class InitIamHandler implements ICommandHandler<InitIamCommand> {
  constructor(
    protected readonly iamService: IamService,
    protected readonly secretsEngineService: SecretsEngineService,
  ) {}

  public async execute(): Promise<void> {
    const privateKey: string | null =
      await this.secretsEngineService.getPrivateKey();

    if (!privateKey) {
      return;
    }

    await this.iamService.setup(privateKey);
  }
}
