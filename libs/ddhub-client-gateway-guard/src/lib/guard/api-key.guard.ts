import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UserGuard } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { PinoLogger } from 'nestjs-pino';

const WHITELISTED_ENDPOINTS = [
  '/api/v2/health',
  '/api/v2/login',
  '/api/v2/login/refresh-token',
  '/api/v2/login/config',
  '/api/v2/gateway',
];

@Injectable()
export class ApiKeyGuard implements CanActivate {
  protected readonly logger = new Logger(ApiKeyGuard.name);

  constructor(
    protected readonly userGuard: UserGuard,
    protected readonly secretsEngineService: SecretsEngineService,
    private readonly _logger: PinoLogger
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { headers } = request;

    if (WHITELISTED_ENDPOINTS.includes(request.url)) {
      return true;
    }

    if (headers.authorization) {
      const authenticated = await this.userGuard.canActivate(context);
      if (authenticated) {
        return true;
      }

      // Stale/invalid bearer tokens should not block unauthenticated access
      // at the global guard; route-level guards handle authorization.
      if (!this.userGuard.isAuthEnabled()) {
        return true;
      }
    }

    const apiKeyFromHeaders: string | undefined = headers['x-api-key'];

    if (apiKeyFromHeaders) {
      const validation = await this.secretsEngineService.validateApiKey(apiKeyFromHeaders);
      request.user = {
        authType: 'api-key',
        apiKey: apiKeyFromHeaders,
        username: apiKeyFromHeaders,
        role: validation.valid ? validation.role : undefined,
      };
      try {
        this._logger.assign({ user: apiKeyFromHeaders });
      } catch {
        // assign requires pino request scope; may be unavailable in global guards
      }

      if (validation.valid) {
        return true;
      }

      // Stale/invalid api keys should not block unauthenticated access
      // at the global guard when auth is disabled; route-level guards handle authorization.
      return !this.userGuard.isAuthEnabled();
    }

    return true;
  }

  protected isAuthEnabled(): boolean {
    return this.secretsEngineService.isAuthEnabled();
  }
}
