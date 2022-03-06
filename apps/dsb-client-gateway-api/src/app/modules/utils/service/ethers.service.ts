import { BadRequestException, Injectable } from '@nestjs/common';
import { BigNumber, providers, utils, Wallet } from 'ethers';
import { BalanceState } from '../balance.const';
import { parseEther } from 'ethers/lib/utils';

@Injectable()
export class EthersService {
  constructor(protected readonly provider: providers.JsonRpcProvider) {}

  public createPrivateKey(): string {
    return Wallet.createRandom().privateKey;
  }

  public async createProof(privateKey: string, did: string): Promise<string> {
    const signer = new Wallet(privateKey);
    const header = {
      alg: 'ES256',
      typ: 'JWT',
    };
    const encodedHeader = utils.base64.encode(
      Buffer.from(JSON.stringify(header))
    );

    const payload = {
      iss: did,
      claimData: {
        blockNumber: 999999999999,
      },
    };

    const encodedPayload = utils.base64.encode(
      Buffer.from(JSON.stringify(payload))
    );
    const message = utils.arrayify(
      utils.keccak256(Buffer.from(`${encodedHeader}.${encodedPayload}`))
    );
    const sig = await signer.signMessage(message);
    const encodedSig = utils.base64.encode(Buffer.from(sig));

    return `${encodedHeader}.${encodedPayload}.${encodedSig}`;
  }

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

  public getWalletFromPrivateKey(privateKey: string): Wallet {
    if (!this.validatePrivateKey(privateKey)) {
      throw new BadRequestException('Invalid private key');
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
