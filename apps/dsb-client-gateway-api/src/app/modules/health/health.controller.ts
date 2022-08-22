import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { DigestGuard } from '../utils/guards/digest.guard';
import { ApiTags } from '@nestjs/swagger';
import { DdhubHealthService } from 'libs/ddhub-client-gateway-message-broker/src/lib/services/ddhub-health.service';

@Controller('health')
@UseGuards(DigestGuard)
@ApiTags('Health')
export class HealthController {
  constructor(protected readonly healthService: DdhubHealthService) {}

  @Get()
  @HealthCheck()
  public async check(): Promise<{
    messageBroker: { statusCode: number; message?: string };
  }> {
    return {
      messageBroker: await this.healthService.health(),
    };
  }
}
