import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { DigestGuard } from '../../utils/guards/digest.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApplicationDTO, GetApplicationsQueryDto } from '../dto';
import { ApplicationsService } from '../service/applications.service';
import { GetApplicationsByNamespaceDto } from '../dto/get-by-namespace.dto';

@Controller('applications')
@ApiTags('Applications')
@UseGuards(DigestGuard)
export class ApplicationsController {
  constructor(
    protected readonly applicationsService: ApplicationsService,
    protected readonly logger: PinoLogger
  ) {}

  @Get('')
  @ApiOperation({
    description: 'Gets Applications',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [ApplicationDTO],
    description: 'List of applications',
  })
  public async getApplications(
    @Query() { roleName }: GetApplicationsQueryDto
  ): Promise<ApplicationDTO[]> {
    this.logger.assign({
      requestedRoleName: roleName,
    });

    return this.applicationsService.getApplications(roleName);
  }

  @ApiOperation({
    description: 'Gets applications for specified namespace',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [ApplicationDTO],
    description: 'List of applications filtered by namespace',
  })
  @Get('/:namespace')
  public async getApplicationsByNamespace(
    @Param() { namespace }: GetApplicationsByNamespaceDto
  ): Promise<ApplicationDTO[]> {
    this.logger.assign({
      requestedNamespace: namespace,
    });

    return this.applicationsService.getApplicationsByNamespace(namespace);
  }
}
