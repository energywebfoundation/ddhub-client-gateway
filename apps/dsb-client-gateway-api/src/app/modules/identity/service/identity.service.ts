import { Injectable } from '@nestjs/common';
import { EthersService } from '../../utils/service/ethers.service';
import { Identity } from '../../storage/storage.interface';
import { IamService } from '../../iam-service/service/iam.service';
import { SecretsEngineService } from '../../secrets-engine/secrets-engine.interface';
import { NoPrivateKeyException } from '../../storage/exceptions/no-private-key.exception';
import { EnrolmentRepository } from '../../storage/repository/enrolment.repository';
import { IdentityRepository } from '../../storage/repository/identity.repository';

@Injectable()
export class IdentityService {
  constructor(
    protected readonly ethersService: EthersService,
    protected readonly enrolmentRepository: EnrolmentRepository,
    protected readonly identityRepository: IdentityRepository,
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly iamService: IamService
  ) {}

  public async getIdentity(): Promise<Identity> {
    const identity: Identity | null = this.identityRepository.getIdentity();

    if (!identity) {
      throw new NoPrivateKeyException();
    }

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

    await this.identityRepository.writeIdentity(publicIdentity);
    await this.secretsEngineService.setPrivateKey(privateKey);
    await this.iamService.setup(privateKey);

    await this.enrolmentRepository.removeEnrolment();
  }
}
