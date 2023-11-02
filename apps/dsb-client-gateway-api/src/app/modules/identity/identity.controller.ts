import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateIdentityDto } from './dto/create-identity.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Identity } from '@ddhub-client-gateway/identity/models';
import { ClaimsResponseDto } from './dto/claims-response.dto';
import { IdentityResponseDto } from './dto/identity-response.dto';
import { IdentityService } from '@dsb-client-gateway/ddhub-client-gateway-identity';
import {
  Roles,
  UserGuard,
  UserRole,
} from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

@Controller('identity')
@ApiTags('Identity')
@UseGuards(UserGuard)
export class IdentityController {
  constructor(protected readonly identityService: IdentityService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Identity data',
    type: () => IdentityResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Validation failed or some requirements were not fully satisfied',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @Roles(UserRole.MESSAGING, UserRole.ADMIN)
  public async get(): Promise<IdentityResponseDto> {
    return this.identityService.getIdentityWithEnrolment();
  }

  @Get('/claims')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Claims data',
    type: () => ClaimsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Validation failed or some requirements were not fully satisfied',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @Roles(UserRole.MESSAGING, UserRole.ADMIN)
  public async getClaims(): Promise<ClaimsResponseDto> {
    return this.identityService.getClaims();
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Identity successfully created',
    type: () => IdentityResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Validation failed or some requirements were not fully satisfied',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  public async post(
    @Body() { privateKey }: CreateIdentityDto
  ): Promise<Identity> {
    await this.identityService.createIdentity(privateKey);

    return this.identityService.getIdentityWithEnrolment();
  }
}
