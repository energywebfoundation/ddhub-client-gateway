import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RetryConfigService } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { TlsAgentService } from '@dsb-client-gateway/ddhub-client-gateway-tls-agent';
import { DdhubBaseService } from './ddhub-base.service';
import { DdhubLoginService } from './ddhub-login.service';
import { lastValueFrom } from 'rxjs';

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
      const agent = await this.tlsAgentService.create();
      this.logger.log('agent cert: ', JSON.stringify(agent));
      const { data, status } = await lastValueFrom(
        this.httpService.get('/health', {
          httpsAgent: agent,
        })
      );

      return { statusCode: status, message: data?.status };
    } catch (e) {
      if (e.response) {
        this.logger.error(`DSB Health failed - ${e.response.data}`);
      }

      return {
        statusCode: e.response? e.response.status : e.status,
        message: e.response? e.response.data : e.message,
      };
    }
  }
}
