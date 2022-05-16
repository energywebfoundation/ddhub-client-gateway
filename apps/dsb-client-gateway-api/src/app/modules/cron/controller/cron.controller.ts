import { Controller, Get, HttpStatus } from '@nestjs/common';
import { CronService } from '../service/cron.service';
import { CronResponseDto } from '../dto/cron.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('cron')
export class CronController {
  constructor(protected readonly cronService: CronService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of CRON jobs results',
    type: [CronResponseDto],
  })
  public async getJobsResults(): Promise<CronResponseDto[]> {
    return this.cronService.get();
  }
}
