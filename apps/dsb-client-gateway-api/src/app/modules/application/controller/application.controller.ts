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
import { SwaggerTags } from '../../../../swagger/swagger.constants';
import {
  Roles,
  UserGuard,
  UserRole,
} from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

// Shared by both operations: where the application data comes from.
@Controller('applications')
@ApiTags(SwaggerTags.APPLICATIONS)
@UseGuards(UserGuard)
export class ApplicationsController {
  constructor(
    protected readonly applicationsService: ApplicationsService,
    protected readonly logger: PinoLogger
  ) {}

  @Get('')
  @ApiOperation({
    summary: 'List the applications in which the gateway holds a role',
    description: [
      'Lists the applications in which the gateway holds a role.',
      '',
      '**Send**',
      '- `roleName`: `user` or `topiccreator`.',
      '',
      '**Returns**',
      '- A list of matching applications. Each has its namespace, details and topic count.',
      '',
      '**Notes**',
      '- Updated about once a minute.',
      '- Empty until the identity is set up and its roles are accepted.',
      '- An application in which the gateway lost its role can still be listed.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [ApplicationDTO],
    description: 'Matching applications. Empty array when none match.',
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
    summary: 'Get applications by namespace',
    description: [
      'Gets an application by its namespace.',
      '',
      '**Returns**',
      '- A list with the application, or an empty list when it is unknown.',
      '',
      '**Notes**',
      '- Covers the applications in which the gateway holds a role, updated about once a minute.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [ApplicationDTO],
    description: 'Applications with this namespace. Empty array when the namespace is unknown.',
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
