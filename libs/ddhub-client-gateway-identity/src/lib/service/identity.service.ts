import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import {
  Claims,
  IamService,
} from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import {
  Enrolment,
  Identity,
  IdentityWithEnrolment,
} from '@dsb-client-gateway/dsb-client-gateway/identity/models';
import {
  NoPrivateKeyException,
  SecretsEngineService,
} from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { CommandBus } from '@nestjs/cqrs';
import { Span } from 'nestjs-otel';
import {
  BalanceState,
  IdentityEntity,
  IdentityRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { LoginCommand } from '@dsb-client-gateway/ddhub-client-gateway-did-auth';
import { EnrolmentService } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';
import { EthersService } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { RefreshKeysCommand } from '@dsb-client-gateway/ddhub-client-gateway-encryption';

@Injectable()
export class IdentityService {
  protected readonly logger = new Logger(IdentityService.name);

  constructor(
    protected readonly ethersService: EthersService,
    protected readonly wrapper: IdentityRepositoryWrapper,
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly iamService: IamService,
    @Inject(forwardRef(() => EnrolmentService))
    protected readonly enrolmentService: EnrolmentService,
    protected readonly commandBus: CommandBus
  ) {}

  public async removeIdentity(): Promise<void> {
    await this.wrapper.identityRepository.clear();
  }

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

  @Span('getIdentity')
  public async getIdentity(
    forceRefresh = false
  ): Promise<IdentityEntity | null> {
    if (forceRefresh) {
      const rootKey: string | null =
        await this.secretsEngineService.getPrivateKey();

      if (!rootKey) {
        throw new NoPrivateKeyException();
      }

      const wallet = this.ethersService.getWalletFromPrivateKey(rootKey);

      const balanceState: BalanceState = await this.ethersService.getBalance(
        wallet.address
      );

      return {
        publicKey: wallet.publicKey,
        balance: balanceState,
        address: wallet.address,
      };
    }

    const identity = await this.wrapper.identityRepository.findOne();

    if (!identity) {
      return this.getIdentity(true);
    }

    return identity;
  }

  @Span('createIdentity')
  public async createIdentity(privateKey?: string): Promise<void> {
    privateKey = privateKey || this.ethersService.createPrivateKey();

    this.logger.log('Creating wallet from private key');

    const wallet = this.ethersService.getWalletFromPrivateKey(privateKey);

    const balanceState = await this.ethersService.getBalance(wallet.address);

    this.logger.log(`Balance state: ${balanceState}`);

    const publicIdentity: IdentityEntity = {
      publicKey: wallet.publicKey,
      balance: balanceState,
      address: wallet.address,
    };

    this.logger.log(`Obtained identity`);
    this.logger.log(publicIdentity);

    await this.wrapper.identityRepository.createOne(publicIdentity);

    await this.secretsEngineService.setPrivateKey(privateKey);

    await this.iamService.setup(privateKey);

    await this.enrolmentService.deleteEnrolment();
    await this.enrolmentService.generateEnrolment();

    if (balanceState === BalanceState.NONE) {
      this.logger.warn(`No balance for ${wallet.address}, not deriving keys`);

      return;
    }

    await this.commandBus.execute(new RefreshKeysCommand());
    await this.commandBus.execute(
      new LoginCommand(privateKey, this.iamService.getDIDAddress())
    );
  }
}
