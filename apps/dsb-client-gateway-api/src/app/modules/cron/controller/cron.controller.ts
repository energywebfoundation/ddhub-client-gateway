import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { CronService } from '../service/cron.service';
import { CronResponseDto } from '../dto/cron.dto';
import { ApiResponse } from '@nestjs/swagger';
import {
  Roles,
  UserGuard,
  UserRole,
} from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

@Controller('cron')
@UseGuards(UserGuard)
export class CronController {
  constructor(protected readonly cronService: CronService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of CRON jobs results',
    type: [CronResponseDto],
  })
  @Roles(UserRole.ADMIN, UserRole.MESSAGING)
  public async getJobsResults(): Promise<CronResponseDto[]> {
    return this.cronService.get();
  }
}
