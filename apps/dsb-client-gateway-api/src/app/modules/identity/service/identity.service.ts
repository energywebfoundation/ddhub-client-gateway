import { Injectable } from '@nestjs/common';
import { EthersService } from '../../utils/service/ethers.service';
import { StorageService } from '../../storage/service/storage.service';
import { Identity } from '../../storage/storage.interface';
import { IamService } from '../../iam-service/service/iam.service';
import { SecretsEngineService } from '../../secrets-engine/secrets-engine.interface';

@Injectable()
export class IdentityService {
  constructor(
    protected readonly ethersService: EthersService,
    protected readonly storageService: StorageService,
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly iamService: IamService
  ) {}

  public async getIdentity(): Promise<Identity> {
    const identity = this.storageService.getIdentity();

    const balanceState = await this.ethersService.getBalance(identity.address);

    return {
      ...identity,
      balance: balanceState,
    };
  }

  public async createIdentity(privateKey?: string): Promise<void> {
    privateKey = privateKey || this.ethersService.createPrivateKey();

    const wallet = this.ethersService.getWalletFromPrivateKey(privateKey);

    const balanceState = await this.ethersService.getBalance(wallet.address);

    const publicIdentity: Identity = {
      publicKey: wallet.publicKey,
      balance: balanceState,
      address: wallet.address,
    };

    await this.storageService.writeIdentity(publicIdentity);
    await this.secretsEngineService.setPrivateKey(privateKey);
    await this.iamService.setup(privateKey);

    await this.storageService.removeEnrolment();
  }
}
