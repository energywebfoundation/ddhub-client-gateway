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
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Identity } from '@ddhub-client-gateway/identity/models';
import { ClaimsResponseDto } from './dto/claims-response.dto';
import { IdentityResponseDto } from './dto/identity-response.dto';
import { IdentityService } from '@dsb-client-gateway/ddhub-client-gateway-identity';
import {
  Roles,
  UserGuard,
  UserRole,
} from '@dsb-client-gateway/ddhub-client-gateway-user-roles';
import { ResponseErrorDto } from '../utils/dto/response-error.dto';
import { SwaggerTags } from '../../../swagger/swagger.constants';

@Controller('identity')
@ApiTags(SwaggerTags.IDENTITY)
@UseGuards(UserGuard)
export class IdentityController {
  constructor(protected readonly identityService: IdentityService) { }

  @Get()
  @ApiOperation({
    summary: 'Get the gateway identity, balance and enrolment',
    description: [
      'Shows the gateway identity and whether it is ready.',
      '',
      '**Returns**',
      '- `address` and `publicKey` of the identity.',
      '- `balance`: funds on the address (`NONE`, `LOW` or `OK`).',
      '- `enrolment`: the roles of the gateway and their status.',
      '',
      '**Notes**',
      '- Ready when `balance` is not `NONE` and every required role is `SYNCED`.',
      '- `ID::NO_PRIVATE_KEY` when no identity is set up yet.',
      '- Needs the blockchain to be reachable.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gateway identity with its current enrolment.',
    type: () => IdentityResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'No identity configured (`ID::NO_PRIVATE_KEY`): no identity has been set up yet, or it is not loaded yet. Set one with `POST /api/v2/identity`.',
    type: ResponseErrorDto,
  })
  @Roles(UserRole.MESSAGING, UserRole.ADMIN, UserRole.SUPERADMIN)
  public async get(): Promise<IdentityResponseDto> {
    return this.identityService.getIdentityWithEnrolment();
  }

  @Get('/claims')
  @ApiOperation({
    summary: 'List the claims held by the gateway DID',
    description: [
      'Lists the role claims SSI Hub holds for the gateway DID.',
      '',
      '**Returns**',
      '- The gateway DID and a list of its claims. Each claim has its role, approval status and `syncedToDidDoc` (published in the DID document).',
      '',
      '**Notes**',
      '- Only roles that were requested are listed.',
      '- Needs a configured identity, otherwise `500 DHCG::UNKNOWN`.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gateway DID and its claims.',
    type: () => ClaimsResponseDto,
  })
  @Roles(UserRole.MESSAGING, UserRole.ADMIN, UserRole.SUPERADMIN)
  public async getClaims(): Promise<ClaimsResponseDto> {
    return this.identityService.getClaims();
  }

  @Post()
  @ApiOperation({
    summary: 'Set the gateway private key (create or replace the identity)',
    description: [
      'Sets or replaces the private key that defines the gateway identity (DID).',
      '',
      '**Send**',
      '- `privateKey`: 64 hex characters, with or without `0x`.',
      '',
      '**Returns**',
      '- The new identity, with its balance and enrolment.',
      '',
      '**Notes**',
      '- The address of the key must hold funds: setting up the identity costs a small transaction fee.',
      '- A different key deletes all data of the previous identity (channels, topics, applications, contacts, clients, messages).',
      '- Sending the current key again keeps everything.',
      '- Without `privateKey` a new, unfunded key is generated, so the request fails.',
      '- Can take a while: it waits for the blockchain and SSI Hub.',
      '- The gateway then requests its role automatically.',
    ].join('\n'),
  })
  @ApiBody({
    type: CreateIdentityDto,
    description:
      'Private key to use. Its address must hold funds on the configured chain.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Identity configured. Returns the new identity with its freshly computed enrolment.',
    type: () => IdentityResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: [
      '- Request validation failed (`VALIDATION::FAILED`), e.g. `privateKey` is not a string.',
      '- `ID::INVALID_PRIVATE_KEY`: `privateKey` does not have a valid length (66 characters with `0x`, or 64 without).',
    ].join('\n'),
    type: ResponseErrorDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: [
      'Returned as `DHCG::UNKNOWN` (see `err.reason`) for:',
      '- Zero balance: `Not enough balance. Address: 0x...`. Fund that address and retry with the same key.',
      '- A private key of the right length that is not valid hex.',
      '- The blockchain or the SSI Hub could not be reached, or the keys could not be published or saved. Retry later with the same key.',
    ].join('\n'),
    type: ResponseErrorDto,
  })
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  public async post(
    @Body() { privateKey }: CreateIdentityDto
  ): Promise<Identity> {
    await this.identityService.createIdentity(privateKey);

    return this.identityService.getIdentityWithEnrolment();
  }
}
