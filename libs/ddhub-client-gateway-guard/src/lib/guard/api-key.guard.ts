import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserGuard } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  protected readonly logger = new Logger(ApiKeyGuard.name);
  protected readonly isAnyCredentialSet: boolean = false;

  constructor(
    protected readonly configService: ConfigService,
    protected readonly userGuard: UserGuard
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
    const apiKey: string | undefined = this.configService.get<
      string | undefined
    >('API_KEY');

    const password: string | undefined = this.configService.get<
      string | undefined
    >('API_PASSWORD');

    const username: string | undefined = this.configService.get<
      string | undefined
    >('API_USERNAME');

    if (!apiKey && !password && !username) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const { headers } = request;

    if (request.url === '/api/v2/health') {
      return true;
    }

    if (headers.authorization) {
      return this.userGuard.canActivate(context);
    }

    const apiKeyFromHeaders: string | undefined = headers['x-api-key'];

    if (apiKeyFromHeaders && apiKeyFromHeaders === apiKey) {
      request.user = 'api-key';
      return true;
    }

    const usernameFromHeaders: string | undefined = headers['x-api-username'];
    const passwordFromHeaders: string | undefined = headers['x-api-password'];

    if (!usernameFromHeaders || !passwordFromHeaders) {
      return false;
    }

    const decodedPassword: string = new Buffer(
      passwordFromHeaders,
      'base64'
    ).toString('ascii');

    return usernameFromHeaders === username && decodedPassword === password;
  }

  protected isAuthEnabled(): boolean {
    return this.configService.get('USER_AUTH_ENABLED', false);
  }
}
