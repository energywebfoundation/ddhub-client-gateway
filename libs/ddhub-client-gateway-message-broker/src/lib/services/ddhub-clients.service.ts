import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RetryConfigService } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { DidAuthService } from '@dsb-client-gateway/ddhub-client-gateway-did-auth';
import { TlsAgentService } from '@dsb-client-gateway/ddhub-client-gateway-tls-agent';
import { DdhubBaseService } from './ddhub-base.service';
import { Span } from 'nestjs-otel';
import { MessageBrokerErrors } from '../ddhub-client-gateway-message-broker.const';
import { DdhubLoginService } from './ddhub-login.service';

@Injectable()
export class DdhubClientsService extends DdhubBaseService {
  protected readonly logger = new Logger(DdhubClientsService.name);

  constructor(
    protected readonly httpService: HttpService,
    protected readonly retryConfigService: RetryConfigService,
    protected readonly didAuthService: DidAuthService,
    protected readonly tlsAgentService: TlsAgentService,
    protected readonly ddhubLoginService: DdhubLoginService
  ) {
    super(
      new Logger(DdhubClientsService.name),
      retryConfigService,
      ddhubLoginService,
      tlsAgentService
    );
  }

  @Span('ddhub_mb_deleteClients')
  public async deleteClients(clientIds: string[]): Promise<void> {
    try {
      await this.request(
        () =>
          this.httpService.delete('/channel/clientIds', {
            httpsAgent: this.tlsAgentService.get(),
            data: {
              clientIds,
            },
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: [MessageBrokerErrors.UNAUTHORIZED_ACCESS],
        }
      );
    } catch (e) {
      this.logger.error(`delete clients failed`, e);

      return null;
    }
  }

  @Span('ddhub_mb_getClients')
  public async getClients(): Promise<string[]> {
    try {
      const r = await this.request<string[]>(
        () =>
          this.httpService.get('/channel/clientIds', {
            httpsAgent: this.tlsAgentService.get(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: [MessageBrokerErrors.UNAUTHORIZED_ACCESS],
        }
      );

      return r.data;
    } catch (e) {
      this.logger.error(`get clients failed`, e);

      return [];
    }
  }
}
