import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RetryConfigService } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { DidAuthService } from '@dsb-client-gateway/ddhub-client-gateway-did-auth';
import { TlsAgentService } from '@dsb-client-gateway/ddhub-client-gateway-tls-agent';
import { Span } from 'nestjs-otel';
import { RoleStatus } from '@ddhub-client-gateway/identity/models';
import promiseRetry from 'promise-retry';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { lastValueFrom } from 'rxjs';
import { UnableToLoginException } from '../exceptions';
import { EnrolmentService } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';

@Injectable()
export class DdhubLoginService {
  protected readonly logger = new Logger(DdhubLoginService.name);

  constructor(
    protected readonly httpService: HttpService,
    protected readonly retryConfigService: RetryConfigService,
    protected readonly didAuthService: DidAuthService,
    protected readonly tlsAgentService: TlsAgentService,
    protected readonly enrolmentService: EnrolmentService,
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly iamService: IamService
  ) {}

  @Span('ddhub_mb_login')
  public async login(forceRelogin = true): Promise<void> {
    this.logger.log('Attempting to login...');

    const privateKey: string | null =
      await this.secretsEngineService.getPrivateKey();

    if (!privateKey) {
      this.logger.error('Private key is missing');

      throw new UnableToLoginException();
    }

    const enrolment = await this.enrolmentService.get();

    if (!enrolment) {
      this.logger.warn('Stopping login, enrolment is not enabled');

      throw new UnableToLoginException();
    }

    const hasRequiredRoles =
      enrolment.roles.filter(
        (role) => role.required === true && role.status === RoleStatus.SYNCED
      ).length > 0;

    if (!hasRequiredRoles) {
      this.logger.warn('Stopping login, roles are missing');

      throw new UnableToLoginException();
    }

    this.logger.log('Attempting to login to DID Auth Server');

    await promiseRetry(async (retry) => {
      await this.didAuthService
        .login(privateKey, this.iamService.getDIDAddress(), forceRelogin)
        .catch((e) => retry(e));
    }, this.retryConfigService.config);

    this.logger.log('Login successful, attempting to init ext channel');

    await this.initExtChannel();
  }

  @Span('ddhub_mb_initExtChannel')
  protected async initExtChannel(): Promise<void> {
    try {
      await promiseRetry(async (retry) => {
        await this.tlsAgentService.create();

        await lastValueFrom(
          this.httpService.post(
            '/channel/initExtChannel',
            {
              httpsAgent: this.tlsAgentService.get(),
            },
            {
              headers: {
                Authorization: `Bearer ${this.didAuthService.getToken()}`,
              },
            }
          )
        ).catch((e) => retry(e));
      }, this.retryConfigService.config);

      this.logger.log('Init ext channel successful');
    } catch (e) {
      this.logger.error('Init ext channel failed', e);
      console.error(e);
    }
  }
}
