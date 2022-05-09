import { Injectable, Logger } from '@nestjs/common';
import { DidAuthApiService } from './did-auth-api.service';
import { EthersService } from '../../../../../apps/dsb-client-gateway-api/src/app/modules/utils/service/ethers.service';

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

    const response = await this.didAuthApiService.login(proof);

    if (!response) {
      throw new Error();
    }

    this.accessToken = response.access_token;
    this.refreshToken = response.refresh_token;
  }
}
