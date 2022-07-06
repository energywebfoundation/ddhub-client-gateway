import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ReloginCommand } from '../command/relogin.command';
import { Logger } from '@nestjs/common';
import { DdhubLoginService } from '../services';

@CommandHandler(ReloginCommand)
export class ReloginHandler implements ICommandHandler<ReloginCommand> {
  protected readonly logger = new Logger();

  constructor(protected readonly ddhubLoginService: DdhubLoginService) {}

  public async execute(): Promise<void> {
    await this.ddhubLoginService.login().catch((e) => {
      this.logger.error('failed during relogin', e);
    });
  }
}
