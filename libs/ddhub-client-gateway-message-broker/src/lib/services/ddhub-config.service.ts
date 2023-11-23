import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RetryConfigService } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { DidAuthService } from '@dsb-client-gateway/ddhub-client-gateway-did-auth';
import { TlsAgentService } from '@dsb-client-gateway/ddhub-client-gateway-tls-agent';
import { DdhubBaseService } from './ddhub-base.service';
import { Span } from 'nestjs-otel';
import { MessageBrokerErrors } from '../ddhub-client-gateway-message-broker.const';
import { DdhubLoginService } from './ddhub-login.service';
import { ConfigDto } from '../dto';

@Injectable()
export class DdhubConfigService extends DdhubBaseService {
  constructor(
    protected readonly httpService: HttpService,
    protected readonly retryConfigService: RetryConfigService,
    protected readonly didAuthService: DidAuthService,
    protected readonly tlsAgentService: TlsAgentService,
    protected readonly ddhubLoginService: DdhubLoginService,
  ) {
    super(
      new Logger(DdhubConfigService.name),
      retryConfigService,
      ddhubLoginService,
      tlsAgentService,
    );
  }

  @Span('ddhub_mb_getConfig')
  public async getConfig(): Promise<ConfigDto> {
    try {
      const r = await this.request<ConfigDto>(
        () =>
          this.httpService.get('/config', {
            httpsAgent: this.tlsAgentService.get(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: [MessageBrokerErrors.UNAUTHORIZED_ACCESS],
        },
      );

      return r.data;
    } catch (e) {
      this.logger.error(`get config failed`, e);

      return null;
    }
  }
}
