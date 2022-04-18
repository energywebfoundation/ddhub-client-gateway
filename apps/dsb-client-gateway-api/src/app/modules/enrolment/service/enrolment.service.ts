import { Injectable } from '@nestjs/common';
import {
  Enrolment,
  Role,
  RoleStatus,
} from '@dsb-client-gateway/dsb-client-gateway/identity/models';
import { EnrolmentRepository } from '../../storage/repository/enrolment.repository';
import {
  Claim,
  IamService,
} from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { ConfigService } from '@nestjs/config';
import { RoleListenerService } from './role-listener.service';
import { Span } from 'nestjs-otel';

@Injectable()
export class EnrolmentService {
  constructor(
    protected readonly iamService: IamService,
    protected readonly configService: ConfigService,
    protected readonly roleListenerService: RoleListenerService,
    protected readonly enrolmentRepository: EnrolmentRepository
  ) {}

  public deleteEnrolment(): void {
    this.enrolmentRepository.removeEnrolment();
  }

  public async startListening(): Promise<void> {
    await this.roleListenerService.startListening();
  }

  public async get(): Promise<Enrolment> {
    const currentEnrolment: Enrolment | null =
      this.enrolmentRepository.getEnrolment();

    if (!currentEnrolment) {
      const createdEnrolment: Enrolment = await this.generateEnrolment();

      await this.enrolmentRepository.writeEnrolment(createdEnrolment);

      return createdEnrolment;
    }

    return currentEnrolment;
  }

  @Span('enrolment_generateEnrolment')
  public async generateEnrolment(): Promise<Enrolment> {
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

    const enrolment: Enrolment = {
      did: this.iamService.getDIDAddress(),
      roles: claimsToRoles,
    };

    await this.enrolmentRepository.writeEnrolment(enrolment);

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
