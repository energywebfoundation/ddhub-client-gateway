import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EthersService } from '../../utils/service/ethers.service';
import { BalanceState } from '../../utils/balance.const';
import { NotEnoughBalanceException } from '../../identity/exceptions/not-enough-balance.exception';
import { IamService } from '../../iam-service/service/iam.service';
import { NatsListenerService } from './nats-listener.service';
import { Enrolment } from '../../storage/storage.interface';
import { NoPrivateKeyException } from '../../storage/exceptions/no-private-key.exception';
import { ConfigService } from '@nestjs/config';
import { EnrolmentRepository } from '../../storage/repository/enrolment.repository';
import { IdentityRepository } from '../../storage/repository/identity.repository';

@Injectable()
export class EnrolmentService implements OnModuleInit {
  private readonly logger = new Logger(EnrolmentService.name);
  private parentNamespace: string;
  private userRole: string;

  constructor(
    protected readonly ethersService: EthersService,
    protected readonly iamService: IamService,
    protected readonly natsListenerService: NatsListenerService,
    protected readonly enrolmentRepository: EnrolmentRepository,
    protected readonly identityRepository: IdentityRepository,
    protected readonly configService: ConfigService
  ) {}

  public async onModuleInit(): Promise<void> {
    this.parentNamespace = this.configService.get<string>(
      'PARENT_NAMESPACE',
      'dsb.apps.energyweb.iam.ewc'
    );
    this.userRole = `user.roles.${this.parentNamespace}`;

    const did = this.iamService.getDIDAddress();

    if (!did) {
      this.logger.log('IAM not initialized to get enrolment');

      return;
    }

    const claims = await this.iamService.getClaimsByRequester(
      did,
      this.parentNamespace
    );

    const state = await this.natsListenerService.getStateFromClaims(claims);

    await this.enrolmentRepository.writeEnrolment({
      did,
      state,
    });

    if (state.waiting) {
      this.logger.log('Initializing enrolment on bootstrap');

      await this.initEnrolment().catch((e) => {
        this.logger.error('Error during enrolment', e);
      });
    }
  }

  public async getEnrolment(): Promise<Enrolment> {
    const enrolment = await this.enrolmentRepository.getEnrolment();

    if (!enrolment) {
      await this.initEnrolment();

      throw new NoPrivateKeyException();
    }

    return this.enrolmentRepository.getEnrolment();
  }

  public async initEnrolment(): Promise<any> {
    const identity = await this.identityRepository.getIdentity();

    if (!identity) {
      return;
    }

    const { address } = identity;

    const did = this.iamService.getDIDAddress();

    if (!did) {
      return;
    }

    if (!address) {
      throw new NoPrivateKeyException();
    }

    const balance = await this.ethersService.getBalance(address);

    if (balance === BalanceState.NONE) {
      throw new NotEnoughBalanceException();
    }

    this.natsListenerService.init();
    this.natsListenerService.startListening();

    const state = await this.natsListenerService.getState();

    if (state.approved || state.waiting) {
      await this.enrolmentRepository.writeEnrolment({
        state,
        did,
      });

      return {
        did,
        state,
      };
    }

    await this.natsListenerService.createClaim();

    const updatedState = await this.natsListenerService.getState();

    await this.enrolmentRepository.writeEnrolment({
      did,
      state: updatedState,
    });

    return {
      did,
      state,
    };
  }
}
