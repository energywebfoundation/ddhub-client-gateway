import { Injectable, Logger } from '@nestjs/common';
import {
  SecretsEngineService,
  UserDetails,
} from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { ConfigService } from '@nestjs/config';
import {
  AuthTokens,
  UserRolesTokenService,
  UserTokenData,
} from './user-roles-token.service';
import { UserRole } from '../const';

@Injectable()
export class UserAuthService {
  protected readonly logger = new Logger(UserAuthService.name);

  constructor(
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly userRolesTokenService: UserRolesTokenService,
    protected readonly configService: ConfigService
  ) { }

  public verifyToken(accessToken: string): UserTokenData {
    return this.userRolesTokenService.verifyToken(accessToken);
  }

  public isAuthEnabled(): boolean {
    if (!this.isUserAuthEnvEnabled()) {
      return false;
    }

    return this.secretsEngineService.isAuthEnabled();
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

  public refreshToken(refreshToken: string): AuthTokens {
    if (!this.isAuthEnabled()) {
      throw new Error('Auth not enabled');
    }

    return this.userRolesTokenService.refreshToken(refreshToken);
  }

  public async login(username: string, password: string): Promise<AuthTokens> {
    if (!this.isAuthEnabled()) {
      throw new Error('Auth not enabled');
    }

    const userDetails: UserDetails =
      await this.secretsEngineService.getUserAuthDetails(username);

    if (!userDetails || !userDetails.password) {
      throw new Error('User does not exist or password is incorrect');
    }

    if (password === userDetails.password) {
      return this.userRolesTokenService.generateTokens(username, userDetails.role as UserRole);
    }

    this.logger.warn('incorrect password attempt');

    throw new Error('User does not exist or password is incorrect');
  }

  public async setUserPassword(username: string, password: string, role: UserRole): Promise<void> {
    if (!this.isAuthEnabled()) {
      throw new Error('Auth not enabled');
    }

    await this.secretsEngineService.setUserPassword(username, password, role);
  }

}
