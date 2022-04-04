import { Injectable, Logger } from '@nestjs/common';
import { EthersService } from '../../utils/service/ethers.service';
import { IamService } from '../../iam-service/service/iam.service';
import { SecretsEngineService } from '../../secrets-engine/secrets-engine.interface';
import { NoPrivateKeyException } from '../../storage/exceptions/no-private-key.exception';
import { EnrolmentRepository } from '../../storage/repository/enrolment.repository';
import { IdentityRepository } from '../../storage/repository/identity.repository';
import { EnrolmentService } from '../../enrolment/service/enrolment.service';
import {
  Claims,
  Enrolment,
  Identity,
  IdentityWithEnrolment,
  RoleState
} from '@dsb-client-gateway/dsb-client-gateway/identity/models';
import { Claim } from 'iam-client-lib';

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
    const claims: Claim[] = await this.iamService.getClaims();
    const synchronizedToDIDClaims =
      await this.iamService.getUserClaimsFromDID();

    const getClaimStatus = (claim: Claim): RoleState => {
      if (claim.isAccepted) {
        return RoleState.APPROVED;
      }

      if (claim.isRejected) {
        return RoleState.REJECTED;
      }

      if (!claim.isAccepted && !claim.isRejected) {
        return RoleState.AWAITING_APPROVAL;
      }

      return RoleState.UNKNOWN;
    };

    return {
      did: this.iamService.getDIDAddress(),
      claims: claims.map((claim) => {
        return {
          namespace: claim.claimType,
          status: getClaimStatus(claim),
          syncedToDidDoc:
            synchronizedToDIDClaims.filter(
              (synchronizedClaim) =>
                synchronizedClaim.claimType === claim.claimType
            ).length > 0,
        };
      }),
    };
  }

  public async getIdentityWithEnrolment(): Promise<IdentityWithEnrolment> {
    const [identity, enrolment]: [Identity, Enrolment] = await Promise.all([
      this.getIdentity(true),
      this.enrolmentService.getEnrolment(),
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

  public async getIdentity(refreshBalance = false): Promise<Identity | null> {
    if (refreshBalance) {
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
      throw new NoPrivateKeyException();
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

    await this.enrolmentRepository.removeEnrolment();

    await this.enrolmentService.initEnrolment();
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
