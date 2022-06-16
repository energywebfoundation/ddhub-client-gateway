import { Injectable, Logger } from '@nestjs/common';
import { DdhubBaseService } from './ddhub-base.service';
import { HttpService } from '@nestjs/axios';
import { RetryConfigService } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { DidAuthService } from '@dsb-client-gateway/ddhub-client-gateway-did-auth';
import { TlsAgentService } from './tls-agent.service';
import { Span } from 'nestjs-otel';
import { DdhubLoginService } from './ddhub-login.service';
import { OperationOptions } from 'retry';
import * as qs from 'qs';

@Injectable()
export class DdhubDidService extends DdhubBaseService {
  constructor(
    protected readonly httpService: HttpService,
    protected readonly retryConfigService: RetryConfigService,
    protected readonly didAuthService: DidAuthService,
    protected readonly tlsAgentService: TlsAgentService,
    protected readonly ddhubLoginService: DdhubLoginService
  ) {
    super(
      new Logger(DdhubDidService.name),
      retryConfigService,
      ddhubLoginService,
      tlsAgentService
    );
  }

  @Span('ddhub_mb_getDIDsFromRoles')
  public async getDIDsFromRoles(
    roles: string[] | undefined,
    searchType: 'ANY',
    overrideRetry?: OperationOptions
  ): Promise<string[]> {
    if (!roles || roles.length === 0) {
      return [];
    }

    const { data } = await this.request<{ dids: string[] }>(
      () =>
        this.httpService.get('/roles/list', {
          params: {
            roles,
            searchType,
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' });
          },
          headers: {
            Authorization: `Bearer ${this.didAuthService.getToken()}`,
          },
        }),
      {},
      overrideRetry
    );

    return data.dids;
  }
}
