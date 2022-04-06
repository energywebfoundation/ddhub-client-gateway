import { Injectable, Logger } from '@nestjs/common';
import { w3cwebsocket } from 'websocket';
import * as EventEmitter from 'events';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { connect, JSONCodec } from 'nats.ws';
import { ConfigService } from '@nestjs/config';
import {
  EnrolmentState,
  RoleState,
} from '@dsb-client-gateway/dsb-client-gateway/identity/models';
import { Claim, ClaimEventType } from 'iam-client-lib';
import { EnrolmentRepository } from '../../storage/repository/enrolment.repository';

globalThis.WebSocket = w3cwebsocket as any;

export enum EnrolmentEvents {
  AWAIT_APPROVAL = 'await_approval',
  APPROVED = 'approved',
}

// export const USER_ROLE = `user.roles.${PARENT_NAMESPACE}`

@Injectable()
export class NatsListenerService {
  private readonly logger = new Logger(NatsListenerService.name);
  private readonly parentNamespace: string;
  private readonly userRole: string;
  private events: EventEmitter;

  constructor(
    protected readonly iamService: IamService,
    protected readonly configService: ConfigService,
    protected readonly enrolmentRepository: EnrolmentRepository
  ) {
    this.parentNamespace = this.configService.get<string>(
      'PARENT_NAMESPACE',
      'dsb.apps.energyweb.iam.ewc'
    );
    this.userRole = `user.roles.${this.parentNamespace}`;
  }

  public startListening() {
    this.events.emit(EnrolmentEvents.AWAIT_APPROVAL);
  }

  public async createClaim(): Promise<void> {
    await this.iamService.requestClaim(this.userRole);
  }

  public async getState(): Promise<EnrolmentState | null> {
    if (!this.iamService) {
      this.logger.error('IAM is not initialized');

      return null;
    }

    const claims = await this.iamService.getClaimsByRequester(
      this.iamService.getDIDAddress(),
      this.parentNamespace
    );

    return this.getStateFromClaims(claims);
  }

  public getStateFromClaims(claims: Claim[]): EnrolmentState {
    const state: EnrolmentState = {
      approved: false,
      waiting: false,
      roles: {
        user: RoleState.NO_CLAIM,
      },
    };
    for (const { claimType, isAccepted } of claims) {
      if (claimType === this.userRole) {
        state.roles.user = isAccepted
          ? RoleState.APPROVED
          : RoleState.AWAITING_APPROVAL;
      }
      state.approved = state.roles.user === RoleState.APPROVED;
      state.waiting = state.roles.user === RoleState.AWAITING_APPROVAL;
    }
    return state;
  }

  public init() {
    this.events = new EventEmitter.EventEmitter();

    const PARENT_NAMESPACE = this.configService.get<string>(
      'PARENT_NAMESPACE',
      'dsb.apps.energyweb.iam.ewc'
    );
    const USER_ROLE = `user.roles.${PARENT_NAMESPACE}`;

    const eventsUrl = this.configService.get<string>(
      'EVENT_SERVER_URL',
      'identityevents-dev.energyweb.org'
    );

    this.events.on(EnrolmentEvents.APPROVED, async () => {
      this.logger.log('Enrolment approved');
    });

    this.events.on(EnrolmentEvents.AWAIT_APPROVAL, async () => {
      const state: EnrolmentState = {
        approved: false,
        waiting: true,
        roles: {
          user: RoleState.AWAITING_APPROVAL,
        },
      };

      this.logger.log(`Connecting to ${eventsUrl}`);

      const nc = await connect({ servers: `wss://${eventsUrl}` });

      const did = this.iamService.getDIDAddress();

      const topic = `${
        ClaimEventType.ISSUE_CREDENTIAL
      }.claim-exchange.${did}.${this.configService.get<string>(
        'NATS_ENV_NAME',
        'ewf-dev'
      )}`;

      this.logger.log('Listening for claim exchange', topic);

      const jc = JSONCodec<{ type: string; claimId: string }>();

      const sub = nc.subscribe(topic);

      try {
        for await (const m of sub) {
          const claimMessage = jc.decode(m.data);
          const count = sub.getProcessed();

          if (!claimMessage.claimId) {
            this.logger.warn(`Missing claimId from message`, claimMessage);
            continue;
          }

          const claim = await this.iamService.getClaimById(
            claimMessage.claimId
          );

          if (!claim) {
            this.logger.warn(`Claim does not exists`, claimMessage);

            continue;
          }

          this.logger.log(`[${count}] Received identity event`, claim);

          if (claim.requester !== did) {
            continue;
          }

          if (claim.issuedToken) {
            this.logger.log(`[${count}] Received claim has been issued`);

            const decodedToken = await this.iamService.decodeJWTToken(
              claim.issuedToken
            );

            if (decodedToken.claimData.claimType === USER_ROLE) {
              this.logger.log(
                `[${count}] Received issued claim is ${this.userRole}`
              );
              await this.iamService.publishPublicClaim(claim.issuedToken);
              this.logger.log(
                `[${count}] Synced ${this.userRole} claim to DID Document`
              );
              state.roles.user = RoleState.APPROVED;
            }
          }

          if (state.roles.user === RoleState.APPROVED && sub) {
            this.logger.log(
              'All roles have been approved and synced to DID Document'
            );

            state.approved = true;
            state.waiting = false;

            await this.enrolmentRepository.writeEnrolment({
              state,
              did: claim.requester,
            });
            await nc.drain();
            await nc.close();

            this.events.emit('approved');
          }
        }
      } catch (e) {
        this.logger.error('Received subscription error. Restarting');

        this.events.emit(EnrolmentEvents.AWAIT_APPROVAL);
      }
    });
  }
}
