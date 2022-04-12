import { Controller, Get, UseGuards } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { DigestGuard } from '../utils/guards/digest.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('health')
@UseGuards(DigestGuard)
@ApiTags('Health')
export class HealthController {
  @Get()
  @HealthCheck()
  public check(): { status: 'healthy' } {
    return {
      status: 'healthy',
    };
  }
}
