import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    UseGuards,
    Param,
  } from '@nestjs/common';
  import { ApiResponse, ApiTags } from '@nestjs/swagger';
  import {
    Roles,
    UserGuard,
    UserRole,
  } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';
  import { IamService, RequesterClaimDTO, ApplicationRoleDTO } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
  import { SearchAppDTO } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
  import { SearchApplicationsQueryDto, GetRolesByNamespaceDto } from '../dto/roles.dto';
  
  @Controller('ssi-hub')
  @ApiTags('SSI Hub')
  @UseGuards(UserGuard)
  export class RolesController {
    constructor(
        private readonly iamService: IamService,
    ) {}
  
    @Get('/roles')
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'My roles',
      type: [RequesterClaimDTO],
    })
    @HttpCode(HttpStatus.OK)
    @Roles(UserRole.ADMIN, UserRole.MESSAGING)
    public async getMyRoles(): Promise<RequesterClaimDTO[]> {
      const did = this.iamService.getDIDAddress();

      return await this.iamService.getRequesterClaims(did);
    }

    @Get('/apps')
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Search apps',
      type: [SearchAppDTO],
    })
    @HttpCode(HttpStatus.OK)
    @Roles(UserRole.ADMIN, UserRole.MESSAGING)
    public async getApps(@Query() { searchKey }: SearchApplicationsQueryDto): Promise<SearchAppDTO[]> {
      return await this.iamService.searchApps(searchKey);
    }

    @Get('/apps/:namespace/roles')
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Get application roles',
      type: [ApplicationRoleDTO],
    })
    @HttpCode(HttpStatus.OK)
    @Roles(UserRole.ADMIN, UserRole.MESSAGING)
    public async getAppRoles(@Param() { namespace }: GetRolesByNamespaceDto): Promise<ApplicationRoleDTO[]> {
      return await this.iamService.getAppRoles(namespace);
    }
  }
  