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
export class DdhubChannelStreamService extends DdhubBaseService {
  protected readonly logger = new Logger(DdhubChannelStreamService.name);

  constructor(
    protected readonly httpService: HttpService,
    protected readonly retryConfigService: RetryConfigService,
    protected readonly didAuthService: DidAuthService,
    protected readonly tlsAgentService: TlsAgentService,
    protected readonly ddhubLoginService: DdhubLoginService,
  ) {
    super(
      new Logger(DdhubChannelStreamService.name),
      retryConfigService,
      ddhubLoginService,
      tlsAgentService,
    );
  }

  @Span('ddhub_mb_stream_delete')
  public async deleteStream(streamName: string): Promise<void> {
    try {
      await this.request(
        () =>
          this.httpService.delete('/channel/clientIds/' + streamName, {
            httpsAgent: this.tlsAgentService.get(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: [MessageBrokerErrors.UNAUTHORIZED_ACCESS],
        },
      );
    } catch (e) {
      this.logger.error(`delete stream failed`, e);
    }
  }
}
