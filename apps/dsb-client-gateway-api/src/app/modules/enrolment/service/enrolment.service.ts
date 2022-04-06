import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { EthersService } from '../../utils/service/ethers.service';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { NatsListenerService } from './nats-listener.service';
import { ConfigService } from '@nestjs/config';
import { EnrolmentRepository } from '../../storage/repository/enrolment.repository';
import {
  BalanceState,
  Enrolment,
  EnrolmentState,
  RoleState,
} from '@dsb-client-gateway/dsb-client-gateway/identity/models';
import { IdentityService } from '../../identity/service/identity.service';
import { IdentityNotReadyException } from '../../identity/exceptions/identity-not-ready.exception';
import { NotEnoughBalanceException } from '../../identity/exceptions/not-enough-balance.exception';

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
    @Inject(forwardRef(() => IdentityService))
    protected readonly identityService: IdentityService,
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

    this.logger.log('Existing state', state);

    await this.enrolmentRepository.writeEnrolment({
      did,
      state,
    });

    await this.initEnrolment().catch((e) => {
      this.logger.error('Error during enrolment', e);
    });
  }

  public getEnrolment(): Enrolment | null {
    const enrolment: Enrolment | null = this.enrolmentRepository.getEnrolment();

    if (!enrolment) {
      return {
        did: this.iamService.getDIDAddress(),
        state: {
          roles: {
            user: RoleState.NO_CLAIM,
          },
          waiting: false,
          approved: false,
        },
      };
    }

    return enrolment;
  }

  public async initEnrolment(): Promise<Enrolment | null> {
    const identity = await this.identityService.getIdentity();

    if (!identity) {
      throw new IdentityNotReadyException('identity');
    }

    const did = this.iamService.getDIDAddress();

    if (!did) {
      this.logger.error('DID could not be obtained');

      throw new IdentityNotReadyException('did');
    }

    const { address, balance } = identity;

    const existingState: EnrolmentState =
      await this.natsListenerService.getState();

    if (!existingState) {
      throw new IdentityNotReadyException('enrolment-state');
    }

    if (existingState.approved) {
      const enrolment: Enrolment = {
        state: existingState,
        did,
      };

      await this.enrolmentRepository.writeEnrolment(enrolment);

      this.logger.log('Enrolment successfully synchronized');

      return enrolment;
    }

    if (balance === BalanceState.NONE) {
      throw new NotEnoughBalanceException(address);
    }

    if (existingState.roles.user === RoleState.NO_CLAIM) {
      await this.natsListenerService.createClaim();
    }

    this.natsListenerService.init();
    this.natsListenerService.startListening();

    return {
      did: this.iamService.getDIDAddress(),
      state: await this.natsListenerService.getState(),
    };
  }
}
