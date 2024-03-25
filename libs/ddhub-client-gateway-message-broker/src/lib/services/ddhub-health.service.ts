import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RetryConfigService } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { TlsAgentService } from '@dsb-client-gateway/ddhub-client-gateway-tls-agent';
import { DdhubBaseService } from './ddhub-base.service';
import { DdhubLoginService } from './ddhub-login.service';
import { lastValueFrom } from 'rxjs';
import { isAxiosError, isError } from '@nestjs/terminus/dist/utils';

@Injectable()
export class DdhubHealthService extends DdhubBaseService {
  constructor(
    protected readonly httpService: HttpService,
    protected readonly retryConfigService: RetryConfigService,
    protected readonly tlsAgentService: TlsAgentService,
    protected readonly ddhubLoginService: DdhubLoginService
  ) {
    super(
      new Logger(DdhubHealthService.name),
      retryConfigService,
      ddhubLoginService,
      tlsAgentService
    );
  }

  public async health(): Promise<{ statusCode: number; message?: string }> {
    try {
      const response = await lastValueFrom(
        this.httpService.get('/health', {
          httpsAgent: await this.tlsAgentService.create(),
        })
      );

      this.logger.log(
        `MB Health response: ${response.status} - ${JSON.stringify(
          response.data
        )}`
      );

      return { statusCode: response?.status, message: response.data?.status };
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        this.logger.error(`MB Health request failed - ${err.message}`);
        return {
          statusCode: err.response?.status || 500,
          message: err.response?.data || 'Internal Server Error',
        };
      }

      return {
        statusCode: 500,
        message: 'Internal Server Error',
      };
    }
  }
}
