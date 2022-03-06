import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebSocketImplementation } from '../../message/message.const';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(protected readonly configService: ConfigService) {}

  public isAuthEnabled(): boolean {
    const [username, password] = [
      this.configService.get<string | undefined>('USERNAME'),
      this.configService.get<string | undefined>('PASSWORD'),
    ];

    return !!username && !!password;
  }

  public onModuleInit(): void {
    const [username, password, mode] = [
      this.configService.get<string | undefined>('USERNAME'),
      this.configService.get<string | undefined>('PASSWORD'),
      this.configService.get<WebSocketImplementation>('WEBSOCKET'),
    ];

    if (mode !== WebSocketImplementation.SERVER) {
      return;
    }

    if (!username && !password) {
      this.logger.warn(
        'Running DSB Client Gateway without username and password is insecure, not recommended in PRODUCTION'
      );

      return;
    }

    if (!username || !password) {
      this.logger.warn('Username or password is not configured');
    }
  }

  public isAuthorized(token: string): boolean {
    const [usernameFromConfig, passwordFromConfig] = [
      this.configService.get<string>('USERNAME'),
      this.configService.get<string>('PASSWORD'),
    ];

    if (!this.isAuthEnabled()) {
      return true;
    }

    const credentials = Buffer.from(token, 'base64').toString('ascii');

    return credentials === `${usernameFromConfig}:${passwordFromConfig}`;
  }
}
