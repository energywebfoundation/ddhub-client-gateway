import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { EnrolmentService } from './enrolment.service';
import {
  BalanceState,
  Enrolment,
  Identity,
  RoleStatus,
} from '@ddhub-client-gateway/identity/models';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { Span } from 'nestjs-otel';
import {
  IdentityService,
  NotEnoughBalanceException,
} from '@dsb-client-gateway/ddhub-client-gateway-identity';
import { NoPrivateKeyException } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { ClaimListenerService } from './claim-listener.service';

@Injectable()
export class RoleListenerService {
  private readonly logger = new Logger(RoleListenerService.name);

  constructor(
    @Inject(forwardRef(() => IdentityService))
    protected readonly identityService: IdentityService,
    @Inject(forwardRef(() => EnrolmentService))
    protected readonly enrolmentService: EnrolmentService,
    protected readonly iamService: IamService,
    @Inject(forwardRef(() => ClaimListenerService))
    protected readonly claimListenerService: ClaimListenerService
  ) {}

  @Span('roleListener_requestClaimsForRequiredRoles')
  public async requestClaimsForRequiredRoles(): Promise<void> {
    const generatedEnrolment: Enrolment =
      await this.enrolmentService.generateEnrolment();

    for (const role of generatedEnrolment.roles) {
      if (role.required && role.status === RoleStatus.NOT_ENROLLED) {
        await this.iamService.requestClaim(role.namespace);
      }
    }
  }

  public async stopListening(): Promise<void> {
    await this.claimListenerService.stop();
  }

  public async startListening(): Promise<Enrolment> {
    const identity: Identity | null = await this.identityService.getIdentity(
      true
    );

    if (!identity) {
      this.logger.warn('Identity is not set');

      throw new NoPrivateKeyException();
    }

    if (identity.balance === BalanceState.NONE) {
      this.logger.error('No balance');

      throw new NotEnoughBalanceException(identity.address);
    }

    const enrolment: Enrolment =
      await this.enrolmentService.generateEnrolment();

    const remainingRolesToEnrol = enrolment.roles.filter(
      (role) => role.required && role.status !== RoleStatus.SYNCED
    );

    if (remainingRolesToEnrol.length === 0) {
      this.logger.log(`All roles are synced, not listening`);

      return;
    }

    this.logger.log(
      'Roles are missing, requesting claims and attempting to enrol',
      JSON.stringify(remainingRolesToEnrol)
    );

    await this.requestClaimsForRequiredRoles();

    await this.claimListenerService.listen(
      remainingRolesToEnrol.map(({ namespace }) => namespace)
    );

    return enrolment;
  }
}
