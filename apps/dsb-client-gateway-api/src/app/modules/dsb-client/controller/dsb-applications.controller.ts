import { Controller, Get, UseGuards, HttpStatus, Query } from '@nestjs/common';
import { DigestGuard } from '../../utils/guards/digest.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApplicationDTO } from '../dsb-client.interface';
import { GetApplicationsQueryDto } from '../dto';
import { TopicService } from '../service/dsb-topic.service';

@Controller('dsb')
@ApiTags('dsb')
@UseGuards(DigestGuard)
export class DsbApplicationsController {
  constructor(protected readonly topicService: TopicService) {}

  @Get('applications')
  @ApiOperation({
    description: 'Gets Applications',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ApplicationDTO,
    description: 'List of applications',
  })
  public async getApplications(@Query() { roleName }: GetApplicationsQueryDto) {
    return this.topicService.getApplications(roleName);
  }
}
