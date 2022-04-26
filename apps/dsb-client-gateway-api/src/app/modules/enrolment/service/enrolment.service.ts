import { Injectable } from '@nestjs/common';
import {
  Role,
  RoleStatus,
} from '@dsb-client-gateway/dsb-client-gateway/identity/models';
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
  constructor(
    protected readonly iamService: IamService,
    protected readonly configService: ConfigService,
    protected readonly roleListenerService: RoleListenerService,
    protected readonly wrapper: EnrolmentWrapperRepository
  ) {}

  public async deleteEnrolment(): Promise<void> {
    await this.wrapper.enrolmentRepository.clear();
  }

  public async startListening(): Promise<void> {
    await this.roleListenerService.startListening();
  }

  public async get(): Promise<EnrolmentEntity> {
    const currentEnrolment: EnrolmentEntity | null =
      await this.wrapper.enrolmentRepository.findOne();

    if (!currentEnrolment) {
      const createdEnrolment: EnrolmentEntity = await this.generateEnrolment();

      await this.wrapper.enrolmentRepository.insert(createdEnrolment);

      return createdEnrolment;
    }

    return currentEnrolment;
  }

  @Span('enrolment_generateEnrolment')
  public async generateEnrolment(): Promise<EnrolmentEntity> {
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
        ({ namespace }: Role) => namespace === requiredRole
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

    return enrolment;
  }

  public getRequiredRoles(): string[] {
    const parentNamespace: string = this.configService.get<string>(
      'PARENT_NAMESPACE',
      'dsb.apps.energyweb.iam.ewc'
    );

    return [`user.roles.${parentNamespace}`];
  }
}
