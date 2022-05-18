import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { DigestGuard } from '../../utils/guards/digest.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApplicationDTO, GetApplicationsQueryDto } from '../dto';
import { ApplicationsService } from '../service/applications.service';

@Controller('applications')
@ApiTags('Applications')
@UseGuards(DigestGuard)
export class ApplicationsController {
  constructor(protected readonly topicService: ApplicationsService) {}

  @Get('')
  @ApiOperation({
    description: 'Gets Applications',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [ApplicationDTO],
    description: 'List of applications',
  })
  public async getApplications(@Query() { roleName }: GetApplicationsQueryDto) {
    return this.topicService.getApplications(roleName);
  }
}
