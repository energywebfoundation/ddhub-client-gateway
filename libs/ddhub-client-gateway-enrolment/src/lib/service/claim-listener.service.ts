import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from 'events';
import { ConfigService } from '@nestjs/config';
import { connect, JSONCodec, Subscription } from 'nats.ws';
import { ClaimEventType } from 'iam-client-lib';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { w3cwebsocket } from 'websocket';
import { EnrolmentService } from './enrolment.service';

globalThis.WebSocket = w3cwebsocket as any;

export enum EnrolmentEvents {
  LISTEN = 'LISTEN',
}

@Injectable()
export class ClaimListenerService {
  private readonly logger = new Logger(ClaimListenerService.name);
  private eventEmitter: EventEmitter;
  private sub: Subscription;
  private rolesToListen: string[];

  constructor(
    private readonly configService: ConfigService,
    private readonly iamService: IamService,
    @Inject(forwardRef(() => EnrolmentService))
    private readonly enrolmentService: EnrolmentService
  ) {}

  public async stop(): Promise<void> {
    this.sub.unsubscribe();

    this.eventEmitter.removeAllListeners();
    this.eventEmitter = null;
  }

  public async listen(roles: string[]): Promise<void> {
    if (this.eventEmitter) {
      this.logger.warn('Already listening');
      this.eventEmitter.emit(EnrolmentEvents.LISTEN);

      return;
    }

    this.eventEmitter = new EventEmitter();

    const eventsUrl = this.configService.get<string>('EVENT_SERVER_URL');

    const nc = await connect({
      servers: `wss://${eventsUrl}`,
    });

    this.eventEmitter.on(EnrolmentEvents.LISTEN, async () => {
      this.sub = nc.subscribe(this.getTopicName());

      this.logger.log(`Listening to ${this.getTopicName()}`);

      try {
        const jc = JSONCodec<{ type: string; claimId: string }>();

        for await (const m of this.sub) {
          const claimMessage = jc.decode(m.data);

          if (!claimMessage.claimId) {
            this.logger.warn('Missing claimId from message', claimMessage);

            continue;
          }

          const claim = await this.iamService.getClaimById(
            claimMessage.claimId
          );

          if (!claim) {
            this.logger.warn('Claim does not exists', claimMessage.claimId);

            continue;
          }

          if (claim.requester !== this.iamService.getDIDAddress()) {
            this.logger.warn(
              'Claim requester does not match DID address',
              claim.requester,
              this.iamService.getDIDAddress
            );

            continue;
          }

          if (claim.issuedToken) {
            this.logger.log(`Received ${this.sub.getProcessed()} messages`);

            const decodedToken = (await this.iamService.decodeJWTToken(
              claim.issuedToken
            )) as any;

            if (roles.includes(decodedToken.claimData.claimType)) {
              this.logger.log(
                `Attempting to publish ${decodedToken.claimData.claimType} to DID document`
              );

              await this.iamService.publishPublicClaim(claim.issuedToken);

              this.logger.log(
                `Synced ${decodedToken.claimData.claimType} claim to DID document`
              );
            }
          }
        }
      } catch (e) {
        this.sub.unsubscribe();

        this.logger.error('Connection failed', e);

        this.eventEmitter.emit(EnrolmentEvents.LISTEN);
      }
    });

    this.eventEmitter.emit(EnrolmentEvents.LISTEN);
  }

  private getTopicName(): string {
    return `${
      ClaimEventType.ISSUE_CREDENTIAL
    }.claim-exchange.${this.iamService.getDIDAddress()}.${this.configService.get<string>(
      'NATS_ENV_NAME',
      'ewf-dev'
    )}`;
  }
}
