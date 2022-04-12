import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EnrolmentService } from './service/enrolment.service';
import { Enrolment } from '@dsb-client-gateway/dsb-client-gateway/identity/models';
import { DigestGuard } from '../utils/guards/digest.guard';
import { ApiTags } from '@nestjs/swagger';

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
