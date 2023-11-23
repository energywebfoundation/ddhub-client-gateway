import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Role, RoleStatus } from '@ddhub-client-gateway/identity/models';
import {
  Claim,
  IamService,
} from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { ConfigService } from '@nestjs/config';
import { RoleListenerService } from './role-listener.service';
import { Span } from 'nestjs-otel';
import {
  EnrolmentEntity,
  EnrolmentWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';

@Injectable()
export class EnrolmentService {
  protected readonly logger = new Logger(EnrolmentService.name);

  constructor(
    protected readonly iamService: IamService,
    protected readonly configService: ConfigService,
    @Inject(forwardRef(() => RoleListenerService))
    protected readonly roleListenerService: RoleListenerService,
    protected readonly wrapper: EnrolmentWrapperRepository,
  ) {}

  public async deleteEnrolment(): Promise<void> {
    await this.wrapper.enrolmentRepository.clear();
  }

  public async stopListening(): Promise<void> {
    await this.roleListenerService.stopListening();
  }

  public async startListening(): Promise<void> {
    await this.roleListenerService.startListening();
  }

  public async getFromCache(): Promise<EnrolmentEntity | null> {
    const didAddress: string = this.iamService.getDIDAddress();

    const currentEnrolment: EnrolmentEntity | null =
      await this.wrapper.enrolmentRepository.findOne({
        where: {
          did: didAddress,
        },
      });

    return currentEnrolment;
  }

  public async get(): Promise<EnrolmentEntity> {
    const didAddress: string = this.iamService.getDIDAddress();
    const currentEnrolment: EnrolmentEntity | null =
      await this.wrapper.enrolmentRepository.findOne({
        where: {
          did: didAddress,
        },
      });

    if (!currentEnrolment) {
      const createdEnrolment: EnrolmentEntity = await this.generateEnrolment();

      return createdEnrolment;
    }

    return currentEnrolment;
  }

  @Span('enrolment_generateEnrolment')
  public async generateEnrolment(): Promise<EnrolmentEntity> {
    this.logger.log('creating new enrolment');

    const existingClaimsWithStatus: Claim[] =
      await this.iamService.getClaimsWithStatus();

    const requiredRoles: string[] = this.getRequiredRoles();

    const claimsToRoles: Role[] = existingClaimsWithStatus.map((claim) => {
      return {
        namespace: claim.namespace,
        status: claim.syncedToDidDoc ? RoleStatus.SYNCED : claim.status,
        required: requiredRoles.includes(claim.namespace),
      };
    });

    requiredRoles.forEach((requiredRole: string) => {
      const exists = claimsToRoles.find(
        ({ namespace }: Role) => namespace === requiredRole,
      );

      if (!exists) {
        claimsToRoles.push({
          status: RoleStatus.NOT_ENROLLED,
          namespace: requiredRole,
          required: true,
        });
      }
    });

    const enrolment: EnrolmentEntity = {
      did: this.iamService.getDIDAddress(),
      roles: claimsToRoles,
    };

    await this.wrapper.enrolmentRepository.createOne(enrolment);

    this.logger.log(`stored enrolment for ${this.iamService.getDIDAddress()}`);

    return enrolment;
  }

  public getRequiredRoles(): string[] {
    const parentNamespace: string = this.configService.get<string>(
      'PARENT_NAMESPACE',
      'ddhub.apps.energyweb.iam.ewc',
    );

    return [`user.roles.${parentNamespace}`];
  }
}
