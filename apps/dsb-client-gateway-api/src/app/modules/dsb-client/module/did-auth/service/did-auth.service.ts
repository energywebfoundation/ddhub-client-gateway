import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { EthersService } from '../../../../utils/service/ethers.service';
import { lastValueFrom } from 'rxjs';
import { DidAuthResponse } from '../did-auth.interface';
import promiseRetry from 'promise-retry';

@Injectable()
export class DidAuthService {
  private readonly logger = new Logger(DidAuthService.name);

  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(
    protected readonly httpService: HttpService,
    protected readonly ethersService: EthersService
  ) {}

  public getToken(): string | null {
    return this.accessToken;
  }

  public async login(privateKey: string, did: string): Promise<void> {
    this.logger.log('Attempting to login');

    const proof = await this.ethersService.createProof(privateKey, did);

    const { access_token, refresh_token } = await promiseRetry(
      async (retry, attempt) => {
        return this.obtainTokens(proof).catch(async (e) => {
          if (this.refreshToken) {
            const refreshTokenData: DidAuthResponse | null =
              await this.getAccessTokenFromRefreshToken();

            if (!refreshTokenData) {
              this.refreshToken = null;
              this.accessToken = null;

              return retry();
            }

            this.refreshToken = refreshTokenData.refresh_token;
            this.accessToken = refreshTokenData.access_token;

            return retry();
          }

          return retry();
        });
      }
    );

    this.accessToken = access_token;
    this.refreshToken = refresh_token;
  }

  private async obtainTokens(proof: string): Promise<DidAuthResponse> {
    const { data } = await lastValueFrom(
      this.httpService.post<DidAuthResponse>('/auth/login', {
        identityToken: proof,
      })
    ).catch((e) => {
      this.logger.error('Login failed');

      this.logger.error(e.message);
      this.logger.error(e.response.data);

      throw e;
    });

    return data;
  }

  private async getAccessTokenFromRefreshToken(): Promise<DidAuthResponse | null> {
    if (!this.refreshToken) {
      this.logger.error('No refresh token to use');

      return null;
    }

    const { data } = await lastValueFrom(
      this.httpService.post<DidAuthResponse>('/auth/refresh-token', {
        refreshToken: this.refreshToken,
      })
    ).catch((e) => {
      this.logger.error('Refresh token failed');

      this.logger.error(e.message);
      this.logger.error(e.response.data);

      throw e;
    });

    this.logger.log('Refresh token successful');

    return data;
  }
}
