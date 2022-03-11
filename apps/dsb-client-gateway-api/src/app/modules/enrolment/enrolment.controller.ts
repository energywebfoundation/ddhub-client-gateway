import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EnrolmentService } from './service/enrolment.service';
import { Enrolment } from '../storage/storage.interface';
import { DigestGuard } from '../utils/guards/digest.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('enrol')
@UseGuards(DigestGuard)
@ApiTags('configuration', 'enrolment')
export class EnrolmentController {
  constructor(protected readonly enrolmentService: EnrolmentService) {}

  @Get('')
  public async get(): Promise<Enrolment> {
    return this.enrolmentService.getEnrolment();
  }

  @Post('')
  public async init() {
    return this.enrolmentService.initEnrolment();
  }
}
