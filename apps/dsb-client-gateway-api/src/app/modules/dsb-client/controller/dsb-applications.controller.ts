import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { DsbApiService } from '../service/dsb-api.service';
import {
  ApplicationDTO,
  IamService,
} from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { DigestGuard } from '../../utils/guards/digest.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetApplicationsQueryDto } from '../dto';

@Controller('dsb')
@UseGuards(DigestGuard)
@ApiTags('applications', 'dsb')
export class DsbApplicationsController {
  constructor(
    protected readonly dsbClientService: DsbApiService,
    protected readonly iamService: IamService
  ) {}

  @Get('applications')
  @ApiOperation({
    description: 'Gets Applications',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ApplicationDTO,
    description: 'List of applications',
  })
  public async getApplications(@Query() { ownerDid }: GetApplicationsQueryDto) {
    const applications = await this.iamService.getApplicationsByOwner(ownerDid);
    const nameSpaces = await applications.map(
      (application) => application.namespace
    );
    const topicsCount = await this.dsbClientService.getTopicsCountByOwner(
      nameSpaces
    );
    const finalApllicationsResult = applications.map((application) => {
      application.topicsCount = topicsCount[application.namespace]
        ? topicsCount[application.namespace]
        : 0;
      return application;
    });
    return finalApllicationsResult;
  }
}
