import { lastValueFrom, Observable } from 'rxjs';
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { OperationOptions } from 'retry';
import promiseRetry from 'promise-retry';
import { HttpStatus, Logger } from '@nestjs/common';
import { isAxiosError } from '@nestjs/terminus/dist/utils';
import {
  RetryConfigService,
  RetryOptions,
} from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { DdhubLoginService } from './ddhub-login.service';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';
import { MessageBrokerException } from '../exceptions';
import { MessageBrokerUnauthorizedException } from '../exceptions/message-broker-unauthrized.exception';
import { TlsAgentService } from '@dsb-client-gateway/ddhub-client-gateway-tls-agent';

export abstract class DdhubBaseService {
  protected constructor(
    protected readonly logger: Logger,
    protected readonly retryConfigService: RetryConfigService,
    protected readonly ddhubLoginService: DdhubLoginService,
    protected readonly tlsAgentService: TlsAgentService,
  ) {}

  protected async request<T>(
    requestFn: () => Observable<AxiosResponse<T>>,
    retryOptions: RetryOptions = {},
    overrideRetryConfig?: OperationOptions,
  ): Promise<{ data: T; headers: any }> {
    const { data, headers } = await promiseRetry<AxiosResponse<T>>(
      async (retry) => {
        return lastValueFrom(requestFn()).catch((err) =>
          this.handleRequestWithRetry(err, retry, retryOptions),
        );
      },
      {
        ...this.retryConfigService.config,
        ...overrideRetryConfig,
      },
    );

    return { data, headers };
  }

  protected async handleRequestWithRetry(
    e,
    retry,
    options: RetryOptions = {},
  ): Promise<any> {
    const defaults: RetryOptions = {
      stopOnStatusCodes: [HttpStatus.FORBIDDEN],
      stopOnResponseCodes: [],
      retryWithAuth: true,
      ...options,
    };

    if (e.errno === -3001 || e.errno === -113) {
      this.logger.error('incorrect network activity');
      this.logger.error(e);

      return retry(e);
    }

    if (!isAxiosError(e)) {
      this.logger.error('Request failed due to unknown error', e);

      throw new MessageBrokerException(
        e.message,
        DsbClientGatewayErrors.MB_UNKNOWN,
        null,
        null,
        null,
      );
    }

    const { status } = e.response;

    this.logger.error('Request failed', e.request.path);
    this.logger.error(e.response.data);

    const invalidCertificateErrorCodes: number[] = [
      495,
      496,
      525,
      526, // 525 and 526 are CloudFlare errors
    ];

    if (invalidCertificateErrorCodes.includes(e.response.status)) {
      this.logger.error(
        `Invalid certificate with response code ${e.response.status}`,
      );

      await this.tlsAgentService.create();

      return retry();
    }

    if (defaults.stopOnStatusCodes.includes(status)) {
      this.logger.error(
        'Request stopped because of stopOnResponseCodes rule',
        status,
        defaults.stopOnStatusCodes,
      );

      throw new MessageBrokerException(
        e.message,
        DsbClientGatewayErrors.MB_ERROR,
        e.response.data.returnCode,
        e.response.data.returnMessage,
        e.request.path,
      );
    }

    if (e.response.data.returnCode && status === HttpStatus.FORBIDDEN) {
      this.logger.error(
        'Request stopped because resource forbidden',
        e.response.data.returnCode,
        defaults.stopOnResponseCodes,
      );

      throw new MessageBrokerUnauthorizedException(
        e.message,
        DsbClientGatewayErrors.MB_ERROR,
        e.response.data.returnCode,
        e.request.path,
      );
    }

    if (
      e.response.data.returnCode &&
      defaults.stopOnResponseCodes.includes(e.response.data.returnCode)
    ) {
      this.logger.error(
        'Request stopped because of stopOnResponseCodes rule',
        e.response.data.returnCode,
        defaults.stopOnResponseCodes,
      );

      throw new MessageBrokerException(
        e.message,
        DsbClientGatewayErrors.MB_ERROR,
        e.response.data.returnCode,
        e.response.data.returnMessage,
        e.request.path,
      );
    }

    if (status === HttpStatus.UNAUTHORIZED) {
      this.logger.log('Unauthorized, attempting to login');

      await this.ddhubLoginService.login(false, 'UNAUTHORIZED');

      return retry();
    }

    throw new MessageBrokerException(
      e.message,
      DsbClientGatewayErrors.MB_ERROR,
      e.response.data.returnCode,
      e.response.data.returnMessage,
      e.request.path,
    );
  }
}
