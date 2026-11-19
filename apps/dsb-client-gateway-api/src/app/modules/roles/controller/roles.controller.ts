import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    UseGuards,
    Param,
    Post,
    Body,
    Delete,
  } from '@nestjs/common';
  import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
  } from '@nestjs/swagger';
  import {
    Roles,
    UserGuard,
    UserRole,
  } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';
  import { IamService, RequesterClaimDTO, ApplicationRoleDTO } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
  import { SearchAppDTO } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
  import { SearchApplicationsQueryDto, GetRolesByNamespaceDto, RequestRoleDto } from '../dto/roles.dto';
  import { SwaggerTags } from '../../../../swagger/swagger.constants';

  @Controller('ssi-hub')
  @ApiTags(SwaggerTags.SSI_HUB)
  @UseGuards(UserGuard)
  export class RolesController {
    constructor(
        private readonly iamService: IamService,
    ) {}

    @Get('/roles')
    @ApiOperation({
      summary: 'List role claims requested by the gateway DID',
      description: [
      'Lists the role requests of the gateway DID in SSI Hub.',
      '',
      '**Returns**',
      '- A list of role requests. Each has its `id`, role, `status` (pending, approved or rejected) and expiry.',
      '',
      '**Notes**',
      '- Use the `id` to withdraw a pending request.',
      '- Needs a configured identity, otherwise `500 DHCG::UNKNOWN`.',
    ].join('\n'),
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'A list of role requests of the gateway DID. Empty if none.',
      type: [RequesterClaimDTO],
    })
    @HttpCode(HttpStatus.OK)
    @Roles(UserRole.ADMIN, UserRole.MESSAGING)
    public async getMyRoles(): Promise<RequesterClaimDTO[]> {
      const did = this.iamService.getDIDAddress();

      return await this.iamService.getRequesterClaims(did);
    }

    @Get('/apps')
    @ApiOperation({
      summary: 'Search SSI Hub applications and organisations',
      description: [
      'Searches SSI Hub for applications and organisations.',
      '',
      '**Send**',
      '- `searchKey`: 3 to 247 characters, matched against names and namespaces.',
      '',
      '**Returns**',
      '- A list of matching applications and organisations. Each has its `namespace`.',
      '',
      '**Notes**',
      '- Needs a configured identity, otherwise `500 DHCG::UNKNOWN`.',
    ].join('\n'),
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Matching applications and organisations. Empty array if nothing matches.',
      type: [SearchAppDTO],
    })
    @HttpCode(HttpStatus.OK)
    @Roles(UserRole.ADMIN, UserRole.MESSAGING)
    public async getApps(@Query() { searchKey }: SearchApplicationsQueryDto): Promise<SearchAppDTO[]> {
      return await this.iamService.searchApps(searchKey);
    }

    @Get('/apps/:namespace/roles')
    @ApiOperation({
      summary: 'List the roles defined by an application',
      description: [
      'Lists the roles defined under an application or organisation.',
      '',
      '**Send**',
      '- `namespace`: namespace of the application or organisation.',
      '',
      '**Returns**',
      '- A list of roles. Each has its `namespace` and the `requestorFields` to fill in when requesting it.',
      '',
      '**Notes**',
      '- Needs a configured identity, otherwise `500 DHCG::UNKNOWN`.',
    ].join('\n'),
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Roles defined under the namespace. Empty array if none.',
      type: [ApplicationRoleDTO],
    })
    @HttpCode(HttpStatus.OK)
    @Roles(UserRole.ADMIN, UserRole.MESSAGING)
    public async getAppRoles(@Param() { namespace }: GetRolesByNamespaceDto): Promise<ApplicationRoleDTO[]> {
      return await this.iamService.getAppRoles(namespace);
    }

    @Post('/role')
    @ApiOperation({
      summary: 'Request a role for the gateway DID',
      description: [
      'Requests a role for the gateway DID.',
      '',
      '**Send**',
      '- `role`: full role namespace (`<role>.roles.<application namespace>`).',
      '- `requestorFields`: values for the fields the role asks for. Omit when there are none.',
      '',
      '**Notes**',
      '- An issuer of the role must approve the request.',
      '- Status: `AWAITING_APPROVAL`, then `APPROVED` or `REJECTED`. Once approved, the gateway publishes the role and it becomes `SYNCED`.',
      '- Needs a configured identity, otherwise `500 DHCG::UNKNOWN`.',
    ].join('\n'),
    })
    @ApiBody({ type: RequestRoleDto, description: 'Role to request and requestor field values.' })
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Claim request submitted to SSI Hub. Empty body.',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles(UserRole.ADMIN, UserRole.MESSAGING)
    public async requestRole(@Body() dto: RequestRoleDto): Promise<void> {
      await this.iamService.requestClaim(dto.role, dto.requestorFields);
    }

    @Delete('/role/:id')
    @ApiOperation({
      summary: 'Withdraw a pending role request',
      description: [
      'Withdraws a pending role request.',
      '',
      '**Send**',
      '- `id`: id of the role request.',
      '',
      '**Notes**',
      '- Only pending requests (`AWAITING_APPROVAL`) can be withdrawn; other attempts fail with `500 DHCG::UNKNOWN`.',
      '- Does not take away a role that was already issued.',
      '- Needs a configured identity.',
    ].join('\n'),
    })
    @ApiParam({
      name: 'id',
      type: String,
      required: true,
      description: 'Id of the role request.',
      example: '7281a130-e2b1-430d-8c14-201010eae901',
    })
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Claim request deleted. Empty body.',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles(UserRole.ADMIN, UserRole.MESSAGING)
    public async deleteRole(@Param('id') id: string): Promise<void> {
      await this.iamService.deleteClaimById(id);
    }
  }
