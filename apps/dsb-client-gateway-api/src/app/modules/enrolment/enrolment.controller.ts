import { Controller, Get, Post } from '@nestjs/common';
import { Enrolment } from '@ddhub-client-gateway/identity/models';
import { ApiTags } from '@nestjs/swagger';
import { EnrolmentService } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';

@Controller('enrol')
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
