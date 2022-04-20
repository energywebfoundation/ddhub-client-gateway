import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IdentityService } from './service/identity.service';
import { CreateIdentityDto } from './dto/create-identity.dto';
import { DigestGuard } from '../utils/guards/digest.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Identity } from '@dsb-client-gateway/dsb-client-gateway/identity/models';
import { ClaimsResponseDto } from './dto/claims-response.dto';
import { IdentityResponseDto } from './dto/identity-response.dto';

@Controller('identity')
@UseGuards(DigestGuard)
@ApiTags('Identity')
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
  @HttpCode(HttpStatus.CREATED)
  @HttpCode(HttpStatus.OK)
  public async post(
    @Body() { privateKey }: CreateIdentityDto
  ): Promise<Identity> {
    await this.identityService.createIdentity(privateKey);

    return this.identityService.getIdentityWithEnrolment();
  }
}
