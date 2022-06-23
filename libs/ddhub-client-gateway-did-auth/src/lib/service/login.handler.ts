import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../command/login.command';
import { DidAuthService } from './did-auth.service';
import { Logger } from '@nestjs/common';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  private readonly logger = new Logger(LoginHandler.name);

  constructor(protected readonly didAuthService: DidAuthService) {}

  public async execute({ did, privateKey }: LoginCommand): Promise<void> {
    if (!privateKey) {
      this.logger.warn('Private key is empty, skipping login');

      return;
    }

    if (!did) {
      this.logger.warn('DID is empty, skipping login');

      return;
    }

    await this.didAuthService
      .login(privateKey, did)
      .then(() => {
        this.logger.log('Login successful');
      })
      .catch((e) => {
        this.logger.error('Login failed', e);
      });
  }
}
