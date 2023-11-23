import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { DidAuthResponse } from '../did-auth.interface';
import { lastValueFrom, timeout } from 'rxjs';
import { TlsAgentService } from '@dsb-client-gateway/ddhub-client-gateway-tls-agent';
import { useInterceptors } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { ConfigService } from '@nestjs/config';
import { VersionService } from '@dsb-client-gateway/ddhub-client-gateway-version';

@Injectable()
export class DidAuthApiService {
  private readonly logger = new Logger(DidAuthApiService.name);

  constructor(
    protected readonly httpService: HttpService,
    protected readonly tlsAgentService: TlsAgentService,
    protected readonly configService: ConfigService,
    protected readonly versionService: VersionService,
  ) {
    useInterceptors(this.httpService, this.logger, versionService);
  }

  public async login(identityToken: string): Promise<DidAuthResponse> {
    const { data } = await lastValueFrom(
      this.httpService
        .post<DidAuthResponse>(
          '/auth/login',
          {
            identityToken,
          },
          {
            httpsAgent: this.tlsAgentService.get(),
          },
        )
        .pipe(timeout(+this.configService.get<number>('MAX_TIMEOUT', 60000))),
    ).catch((e) => {
      this.logger.error(`[Login Failed][msg] ${e.message}`);
      this.logger.error(
        `[Login Failed][data] ${JSON.stringify(e.response?.data)}`,
      );

      throw e;
    });

    return data;
  }

  public async refreshToken(
    refreshToken: string | null,
  ): Promise<DidAuthResponse | null> {
    if (!this.refreshToken) {
      this.logger.error('No refresh token to use');

      return null;
    }

    const { data } = await lastValueFrom(
      this.httpService
        .post<DidAuthResponse>(
          '/auth/refresh-token',
          {
            refreshToken,
          },
          {
            httpsAgent: this.tlsAgentService.get(),
          },
        )
        .pipe(timeout(+this.configService.get<number>('MAX_TIMEOUT', 60000))),
    ).catch((e) => {
      this.logger.error('Refresh token failed');

      this.logger.error(e.message);
      this.logger.error(
        `[Refresh token Failed][data] ${JSON.stringify(e.response?.data)}`,
      );

      throw e;
    });

    return data;
  }
}
