import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  protected readonly logger = new Logger(ApiKeyGuard.name);
  protected readonly isAnyCredentialSet: boolean = false;

  constructor(protected readonly configService: ConfigService, protected readonly secretsEngineService: SecretsEngineService) {
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

    if (isAnySet.length !== 3) {
      throw new Error('one of API_KEY/API_USERNAME/API_PASSWORD is not set');
    }

    this.isAnyCredentialSet = true;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { headers } = request;

    const apiKeyFromHeaders: string | undefined = headers['x-api-key'];
    if (apiKeyFromHeaders) {
      const isValid = await this.secretsEngineService.validateApiKey(apiKeyFromHeaders);
      return isValid;
    }

    return false;
  }

  protected isAuthEnabled(): boolean {
    return this.secretsEngineService.isAuthEnabled();
  }
}
