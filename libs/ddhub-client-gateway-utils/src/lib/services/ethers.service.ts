import { BalanceState } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { Injectable } from '@nestjs/common';
import { BigNumber, providers, utils, Wallet } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { Span } from 'nestjs-otel';
import base64url from 'base64url'
import { InvalidPrivateKeyException } from '../exceptions/invalid-private-key.exception';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EthersService {
  constructor(
    protected readonly provider: providers.JsonRpcProvider,
    private readonly configService: ConfigService,
  ) { }

  public createPrivateKey(): string {
    return Wallet.createRandom().privateKey;
  }

  @Span('ethers_createProof')
  public async createProof(privateKey: string, did: string): Promise<string> {
    const signer = new Wallet(privateKey);
    const header = {
      alg: 'ES256',
      typ: 'JWT',
    };
    const encodedHeader = base64url(JSON.stringify(header));
    const ttl: number = this.configService.get<number>('IDENTITY_TOKEN_TTL', 300);
    const payload = {
      iss: did,
      claimData: {
        blockNumber: 999999999999,
      },
      iat: Math.floor(Date.now() / 1000), // Current
      exp: Math.floor(Date.now() / 1000) + ttl  // Expires in 5 minutes
    };

    const encodedPayload = base64url(JSON.stringify(payload));
    const message = utils.arrayify(
      utils.keccak256(Buffer.from(`${encodedHeader}.${encodedPayload}`))
    );
    const sig = await signer.signMessage(message);
    const encodedSig = base64url(sig);

    return `${encodedHeader}.${encodedPayload}.${encodedSig}`;
  }

  @Span('ethers_getBalance')
  public async getBalance(address: string): Promise<BalanceState> {
    const balance: BigNumber = await this.provider.getBalance(address);

    if (balance.eq(BigNumber.from(0))) {
      return BalanceState.NONE;
    }

    if (balance.lt(BigNumber.from(parseEther('0.005')))) {
      return BalanceState.LOW;
    }

    return BalanceState.OK;
  }

  @Span('ethers_getWalletFromPrivateKey')
  public getWalletFromPrivateKey(privateKey: string): Wallet {
    if (!this.validatePrivateKey(privateKey)) {
      throw new InvalidPrivateKeyException();
    }

    return new Wallet(privateKey);
  }

  public validatePrivateKey(privateKey: string): boolean {
    const isValidPrefixed =
      privateKey.startsWith('0x') && privateKey.length === 66;
    const isValidNoPrefix =
      !privateKey.startsWith('0x') && privateKey.length === 64;

    return !(!isValidPrefixed && !isValidNoPrefix);
  }
}
