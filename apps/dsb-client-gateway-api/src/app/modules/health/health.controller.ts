import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('Health')
export class HealthController {
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
