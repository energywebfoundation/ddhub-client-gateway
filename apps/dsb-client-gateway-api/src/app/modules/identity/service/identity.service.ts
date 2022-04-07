import { Injectable, Logger } from '@nestjs/common';
import { EthersService } from '../../utils/service/ethers.service';
import {
  Claims,
  IamService,
} from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { NoPrivateKeyException } from '../../storage/exceptions/no-private-key.exception';
import { EnrolmentRepository } from '../../storage/repository/enrolment.repository';
import { IdentityRepository } from '../../storage/repository/identity.repository';
import { EnrolmentService } from '../../enrolment/service/enrolment.service';
import {
  Enrolment,
  Identity,
  IdentityWithEnrolment,
} from '@dsb-client-gateway/dsb-client-gateway/identity/models';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';

@Injectable()
export class IdentityService {
  protected readonly logger = new Logger(IdentityService.name);

  constructor(
    protected readonly ethersService: EthersService,
    protected readonly enrolmentRepository: EnrolmentRepository,
    protected readonly identityRepository: IdentityRepository,
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly iamService: IamService,
    protected readonly enrolmentService: EnrolmentService
  ) {}

  public async getClaims(): Promise<Claims> {
    return {
      did: this.iamService.getDIDAddress(),
      claims: await this.iamService.getClaimsWithStatus(),
    };
  }

  public async getIdentityWithEnrolment(): Promise<IdentityWithEnrolment> {
    const [identity, enrolment]: [Identity, Enrolment] = await Promise.all([
      this.getIdentity(true),
      this.enrolmentService.get(),
    ]);

    return {
      ...identity,
      enrolment,
    };
  }

  public async identityReady(): Promise<boolean> {
    const identity: Identity | null = await this.getIdentity();

    return !!identity;
  }

  public async getIdentity(forceRefresh = false): Promise<Identity | null> {
    if (forceRefresh) {
      const rootKey: string | null =
        await this.secretsEngineService.getPrivateKey();

      if (!rootKey) {
        throw new NoPrivateKeyException();
      }

      const wallet = this.ethersService.getWalletFromPrivateKey(rootKey);

      const balanceState = await this.ethersService.getBalance(wallet.address);

      return {
        publicKey: wallet.publicKey,
        balance: balanceState,
        address: wallet.address,
      };
    }

    const identity = this.identityRepository.getIdentity();

    if (!identity) {
      return this.getIdentity(true);
    }

    return identity;
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

    await this.enrolmentService.deleteEnrolment();
  }

  /**
   *
   * @param payload message paylaod stringified
   * @returns signature (string of concatenated r+s+v)
   */
  public async signPayload(payload: string): Promise<string> {
    this.logger.debug('signing payload');
    this.logger.debug('fetching private key');
    const privateKey = await this.secretsEngineService.getPrivateKey();
    if (!privateKey) {
      throw new NoPrivateKeyException();
    }

    const signer = this.ethersService.getWalletFromPrivateKey(privateKey);
    return signer.signMessage(payload);
  }
}
