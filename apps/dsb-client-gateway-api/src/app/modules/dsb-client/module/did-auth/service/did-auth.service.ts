import { Injectable, Logger } from '@nestjs/common';
import { EthersService } from '../../../../utils/service/ethers.service';
import { DidAuthResponse } from '../did-auth.interface';
import { DidAuthApiService } from './did-auth-api.service';

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

  public async login(privateKey: string, did: string): Promise<void> {
    this.logger.log('Attempting to login');

    const proof = await this.ethersService.createProof(privateKey, did);

    const response = await this.didAuthApiService
      .login(proof)
      .catch(async (e) => {
        if (this.refreshToken) {
          const refreshTokenData: DidAuthResponse | null =
            await this.didAuthApiService.refreshToken(this.refreshToken);

          if (!refreshTokenData) {
            this.refreshToken = null;
            this.accessToken = null;

            throw e;
          }

          this.refreshToken = refreshTokenData.refresh_token;
          this.accessToken = refreshTokenData.access_token;
        }
      });

    if (!response) {
      throw new Error();
    }

    this.accessToken = response.access_token;
    this.refreshToken = response.refresh_token;
  }
}
