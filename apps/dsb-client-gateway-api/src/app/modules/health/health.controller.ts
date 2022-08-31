import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { DigestGuard } from '../utils/guards/digest.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('health')
@UseGuards(DigestGuard)
@ApiTags('Health')
export class HealthController {
  constructor() {}

  @Get()
  @HealthCheck()
  public async check(): Promise<{
    message: string;
  }> {
    return {
      message: 'OK',
    };
  }
}
