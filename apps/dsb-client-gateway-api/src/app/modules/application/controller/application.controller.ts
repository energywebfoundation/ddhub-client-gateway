import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { ApplicationDTO, GetApplicationsQueryDto } from '../dto';
import { ApplicationsService } from '../service/applications.service';
import { GetApplicationsByNamespaceDto } from '../dto/get-by-namespace.dto';
import {
  Roles,
  UserGuard,
  UserRole,
} from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

@Controller('applications')
@ApiTags('Applications')
@UseGuards(UserGuard)
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
  @Roles(UserRole.ADMIN, UserRole.MESSAGING)
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
  @Roles(UserRole.ADMIN, UserRole.MESSAGING)
  public async getApplicationsByNamespace(
    @Param() { namespace }: GetApplicationsByNamespaceDto
  ): Promise<ApplicationDTO[]> {
    this.logger.assign({
      requestedNamespace: namespace,
    });

    return this.applicationsService.getApplicationsByNamespace(namespace);
  }
}
