import { Injectable, Logger } from '@nestjs/common';
import { EthersService } from '../../utils/service/ethers.service';
import { Identity } from '../../storage/storage.interface';
import { IamService } from '../../iam-service/service/iam.service';
import { SecretsEngineService } from '../../secrets-engine/secrets-engine.interface';
import { NoPrivateKeyException } from '../../storage/exceptions/no-private-key.exception';
import { EnrolmentRepository } from '../../storage/repository/enrolment.repository';
import { IdentityRepository } from '../../storage/repository/identity.repository';

@Injectable()
export class IdentityService {
  protected readonly logger = new Logger(IdentityService.name);

  constructor(
    protected readonly ethersService: EthersService,
    protected readonly enrolmentRepository: EnrolmentRepository,
    protected readonly identityRepository: IdentityRepository,
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly iamService: IamService
  ) {}

  public async identityReady(): Promise<boolean> {
    const identity: Identity | null = await this.getIdentity();

    return !!identity;
  }

  public async getIdentity(): Promise<Identity | null> {
    const identity: Identity | null = this.identityRepository.getIdentity();

    if (!identity) {
      return null;
    }

    const balanceState = await this.ethersService.getBalance(identity.address);

    return {
      ...identity,
      balance: balanceState,
    };
  }

  public async getIdentityOrThrow(): Promise<Identity> {
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

    this.logger.log('Creating wallet from private key');

    const wallet = this.ethersService.getWalletFromPrivateKey(privateKey);

    const balanceState = await this.ethersService.getBalance(wallet.address);

    this.logger.log(`Balance state: ${balanceState}`);

    const publicIdentity: Identity = {
      publicKey: wallet.publicKey,
      balance: balanceState,
      address: wallet.address,
    };

    this.logger.log(`Obtained identity`);
    this.logger.log(publicIdentity);

    await this.identityRepository.writeIdentity(publicIdentity);
    await this.secretsEngineService.setPrivateKey(privateKey);
    await this.iamService.setup(privateKey);

    await this.enrolmentRepository.removeEnrolment();
  }
}
