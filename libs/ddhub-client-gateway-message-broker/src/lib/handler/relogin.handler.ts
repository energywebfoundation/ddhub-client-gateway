import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ReloginCommand } from '../command/relogin.command';
import { Logger } from '@nestjs/common';
import { DdhubLoginService } from '../services';

@CommandHandler(ReloginCommand)
export class ReloginHandler implements ICommandHandler<ReloginCommand> {
  protected readonly logger = new Logger(ReloginHandler.name);

  constructor(protected readonly ddhubLoginService: DdhubLoginService) {}

  public async execute(command: ReloginCommand): Promise<void> {
    await this.ddhubLoginService.login(true, command.source).catch((e) => {
      this.logger.error('Failed to relogin', e);
    });
  }
}
