import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { EthersService } from '../../utils/service/ethers.service';
import { IamService } from '../../iam-service/service/iam.service';
import { NatsListenerService } from './nats-listener.service';
import {
  Enrolment,
  EnrolmentState,
  RoleState,
} from '../../storage/storage.interface';
import { ConfigService } from '@nestjs/config';
import { EnrolmentRepository } from '../../storage/repository/enrolment.repository';
import { BalanceState } from '../../utils/balance.const';
import { IdentityService } from '../../identity/service/identity.service';

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

  public getEnrolment(): Enrolment | null {
    const enrolment: Enrolment | null = this.enrolmentRepository.getEnrolment();

    if (!enrolment) {
      return {
        did: null,
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
      this.logger.error('No identity found');

      return null;
    }

    const did = this.iamService.getDIDAddress();

    if (!did) {
      this.logger.error('DID could not be obtained');

      return null;
    }

    const { address, balance } = identity;

    const existingState: EnrolmentState =
      await this.natsListenerService.getState();

    if (!existingState) {
      return null;
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
      this.logger.error(`Identity has no balance ${address}`);

      return;
    }

    if (existingState.roles.user === RoleState.NO_CLAIM) {
      await this.natsListenerService.createClaim();
    }

    this.natsListenerService.init();
    this.natsListenerService.startListening();

    // if (!identity) {
    //   return;
    // }
    //
    // const { address } = identity;
    //
    // const did = this.iamService.getDIDAddress();
    //
    // if (!did) {
    //   return;
    // }
    //
    // if (!address) {
    //   throw new NoPrivateKeyException();
    // }
    //
    // const balance = await this.ethersService.getBalance(address);
    //
    // if (balance === BalanceState.NONE) {
    //   this.logger.error(`Account does not have enough balance ${address}`);
    //
    //   return {
    //     did,
    //     state: {
    //       roles: {
    //         user: RoleState.NO_CLAIM,
    //       },
    //       waiting: false,
    //       approved: false,
    //     },
    //   };
    // }
    //
    // this.natsListenerService.init();
    // this.natsListenerService.startListening();
    //
    // const state = await this.natsListenerService.getState();
    //
    // if (state.approved || state.waiting) {
    //   await this.enrolmentRepository.writeEnrolment({
    //     state,
    //     did,
    //   });
    //
    //   return {
    //     did,
    //     state,
    //   };
    // }
    //
    // await this.natsListenerService.createClaim();
    //
    // const updatedState = await this.natsListenerService.getState();
    //
    // await this.enrolmentRepository.writeEnrolment({
    //   did,
    //   state: updatedState,
    // });
    //
    // return {
    //   did,
    //   state,
    // };
  }
}
