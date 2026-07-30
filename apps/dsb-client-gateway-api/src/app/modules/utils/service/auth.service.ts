import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SecretsEngineService,
  UserDetails,
} from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { WebSocketImplementation } from '../../message/message.const';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    protected readonly configService: ConfigService,
    protected readonly secretsEngineService: SecretsEngineService
  ) {}

  public isAuthEnabled(): boolean {
    return this.isUserAuthEnvEnabled();
  }

  private isUserAuthEnvEnabled(): boolean {
    const value = this.configService.get<string | boolean>(
      'USER_AUTH_ENABLED',
      false
    );

    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }

    return false;
  }

  public onModuleInit(): void {
    const mode = this.configService.get<WebSocketImplementation>('WEBSOCKET');

    if (mode !== WebSocketImplementation.SERVER) {
      return;
    }

    if (!this.isAuthEnabled()) {
      this.logger.warn(
        'Running DSB Client Gateway without configured users is insecure, not recommended in PRODUCTION'
      );
    }
  }

  public async isAuthorized(token: string): Promise<boolean> {
    if (!this.isAuthEnabled()) {
      return true;
    }

    const credentials = Buffer.from(token, 'base64').toString('ascii');
    const separatorIndex = credentials.indexOf(':');

    if (separatorIndex === -1) {
      return false;
    }

    const username = credentials.substring(0, separatorIndex);
    const password = credentials.substring(separatorIndex + 1);

    const userDetails: UserDetails =
      await this.secretsEngineService.getUserAuthDetails(username);

    return !!userDetails && userDetails.password === password;
  }
}
