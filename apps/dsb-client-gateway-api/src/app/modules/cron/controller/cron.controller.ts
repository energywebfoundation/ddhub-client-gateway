import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { CronService } from '../service/cron.service';
import { CronResponseDto } from '../dto/cron.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Roles,
  UserGuard,
  UserRole,
} from '@dsb-client-gateway/ddhub-client-gateway-user-roles';
import { SwaggerTags } from '../../../../swagger/swagger.constants';

@Controller('cron')
@ApiTags(SwaggerTags.CRON)
@UseGuards(UserGuard)
export class CronController {
  constructor(protected readonly cronService: CronService) {}

  @Get()
  @ApiOperation({
    summary: 'List the latest result of each background job',
    description: [
      'Shows the latest result of each background job.',
      '',
      '**Returns**',
      '- A list of jobs that ran. Each has its result (`SUCCESS` or `FAILED`) and when it ran.',
      '',
      '**Notes**',
      '- Disabled jobs, and jobs that never ran, are not listed.',
      '- Cleared when the identity changes.',
      '- For failures, check the gateway logs.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Latest result of every job that has run. Empty array if none ran yet. No particular order.',
    type: [CronResponseDto],
  })
  @Roles(UserRole.ADMIN, UserRole.MESSAGING)
  public async getJobsResults(): Promise<CronResponseDto[]> {
    return this.cronService.get();
  }
}
