import { Controller, Get, UseGuards } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { DigestGuard } from '../utils/guards/digest.guard';

@Controller('health')
@UseGuards(DigestGuard)
export class HealthController {
  @Get()
  @HealthCheck()
  public check(): { status: 'healthy' } {
    return {
      status: 'healthy',
    };
  }
}
