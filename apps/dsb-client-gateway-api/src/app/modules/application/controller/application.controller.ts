import { Controller, Get, UseGuards, HttpStatus, Query } from '@nestjs/common';
import { DigestGuard } from '../../utils/guards/digest.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetApplicationsQueryDto, ApplicationDTO } from '../dto';
import { TopicService } from '../service/topic.service';

@Controller('applications')
@ApiTags('Applications')
@UseGuards(DigestGuard)
export class ApplicationsController {
  constructor(protected readonly topicService: TopicService) {}

  @Get('applications')
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
