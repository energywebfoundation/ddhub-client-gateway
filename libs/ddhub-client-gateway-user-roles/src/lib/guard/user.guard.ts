import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UserAuthService } from '../service/user-auth.service';
import { Reflector } from '@nestjs/core';
import { EXCLUDED_ROUTE, ROLES_KEY, UserRole } from '../const';
import { UserTokenData } from '../service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserGuard implements CanActivate {
  protected readonly logger = new Logger(UserGuard.name);

  constructor(
    protected readonly userAuthService: UserAuthService,
    protected readonly reflector: Reflector
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.userAuthService.isAuthEnabled()) {
      this.logger.debug('auth disabled');

      return true;
    }

    const request = context.switchToHttp().getRequest();

    const excludedRoute: boolean = this.reflector.get<boolean>(
      EXCLUDED_ROUTE,
      context.getHandler()
    );

    if (excludedRoute === true) {
      return true;
    }

    const authHeader = request.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];

      try {
        const decodedToken: UserTokenData =
          this.userAuthService.verifyToken(token);

        if (decodedToken.accountType === UserRole.ADMIN) {
          return true;
        }

        const requiredRoles = this.reflector.get<string[]>(
          ROLES_KEY,
          context.getHandler()
        );

        return requiredRoles.some((role) => role === decodedToken.accountType);
      } catch (e) {
        return false;
      }
    }

    return false;
  }
}
