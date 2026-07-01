import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
  protected readonly isAnyCredentialSet: boolean = false;

  constructor(
    protected readonly configService: ConfigService,
    protected readonly userGuard: UserGuard,
    protected readonly secretsEngineService: SecretsEngineService,
    private readonly _logger: PinoLogger
  ) {
    const credentials: Array<string | undefined> = [
      this.configService.get<string | undefined>('API_KEY'),
      this.configService.get<string | undefined>('API_PASSWORD'),
      this.configService.get<string | undefined>('API_USERNAME'),
    ];

    const isAnySet = credentials.filter((credential: string) => !!credential);

    if (!isAnySet.length) {
      this.isAnyCredentialSet = false;

      return;
    }

    if (credentials[0] || (credentials[1] && credentials[2])) {
      this.isAnyCredentialSet = true;

      return;
    }

    throw new Error('one of API_KEY/API_USERNAME/API_PASSWORD is not set');
  }

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
      const isValid = await this.secretsEngineService.validateApiKey(apiKeyFromHeaders);
      request.user = {
        authType: 'api-key',
        apiKey: apiKeyFromHeaders,
        username: apiKeyFromHeaders,
      };
      try {
        this._logger.assign({ user: apiKeyFromHeaders });
      } catch {
        // assign requires pino request scope; may be unavailable in global guards
      }
      return isValid;
    }

    return true;
  }

  protected isAuthEnabled(): boolean {
    return this.secretsEngineService.isAuthEnabled();
  }
}
