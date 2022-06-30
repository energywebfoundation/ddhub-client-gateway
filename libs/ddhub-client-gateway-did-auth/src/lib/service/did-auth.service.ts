import { Injectable, Logger } from '@nestjs/common';
import { DidAuthApiService } from './did-auth-api.service';
import { EthersService } from '@dsb-client-gateway/ddhub-client-gateway-utils';

@Injectable()
export class DidAuthService {
  private readonly logger = new Logger(DidAuthService.name);

  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(
    protected readonly didAuthApiService: DidAuthApiService,
    protected readonly ethersService: EthersService
  ) {}

  public getToken(): string | null {
    return this.accessToken;
  }

  public async login(
    privateKey: string,
    did: string,
    forceRelogin = false
  ): Promise<void> {
    this.logger.log('Attempting to login');

    if (this.refreshToken && !forceRelogin) {
      this.logger.log('attempting to refresh token');

      await this.didAuthApiService
        .refreshToken(this.refreshToken)
        .then((response) => {
          this.accessToken = response.access_token;
          this.refreshToken = response.refresh_token;
        })
        .catch((e) => {
          this.logger.warn('refresh token failed', e);

          this.accessToken = null;
          this.refreshToken = null;

          return this.login(privateKey, did);
        });

      return;
    }

    const proof = await this.ethersService.createProof(privateKey, did);

    const response = await this.didAuthApiService.login(proof);

    if (!response) {
      throw new Error();
    }

    this.accessToken = response.access_token;
    this.refreshToken = response.refresh_token;
  }
}
