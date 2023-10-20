import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Enrolment } from '@ddhub-client-gateway/identity/models';
import { ApiTags } from '@nestjs/swagger';
import { EnrolmentService } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';
import {
  Roles,
  UserGuard,
  UserRole,
} from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

@Controller('enrol')
@ApiTags('Enrolment')
@UseGuards(UserGuard)
export class EnrolmentController {
  constructor(protected readonly enrolmentService: EnrolmentService) {}

  @Get()
  @Roles(UserRole.MESSAGING, UserRole.ADMIN)
  public async get(): Promise<Enrolment> {
    return this.enrolmentService.get();
  }

  @Post()
  @Roles(UserRole.ADMIN)
  public async init() {
    await this.enrolmentService.startListening();
  }
}
