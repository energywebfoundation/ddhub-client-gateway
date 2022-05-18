import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Enrolment } from '@ddhub-client-gateway/identity/models';
import { DigestGuard } from '../utils/guards/digest.guard';
import { ApiTags } from '@nestjs/swagger';
import { EnrolmentService } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';

@Controller('enrol')
@UseGuards(DigestGuard)
@ApiTags('Enrolment')
export class EnrolmentController {
  constructor(protected readonly enrolmentService: EnrolmentService) {}

  @Get()
  public async get(): Promise<Enrolment> {
    return this.enrolmentService.get();
  }

  @Post()
  public async init() {
    await this.enrolmentService.startListening();
  }
}
