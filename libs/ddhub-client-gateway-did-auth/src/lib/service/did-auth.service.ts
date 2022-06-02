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

  public async login(privateKey: string, did: string): Promise<void> {
    this.logger.log('Attempting to login');

    this.logger.log('Creating proof');
    const proof = await this.ethersService.createProof(privateKey, did);
    this.logger.log('Created proof');
    this.logger.log(proof);

    this.logger.log('Logging in now...');
    const response = await this.didAuthApiService
      .login(proof)
      .catch((err) => this.logger.error(err));
    this.logger.log('Logging in response');
    this.logger.log(response);

    if (!response) {
      throw new Error();
    }

    this.accessToken = response.access_token;
    this.refreshToken = response.refresh_token;
  }
}
