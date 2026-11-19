import {
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Enrolment } from '@ddhub-client-gateway/identity/models';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EnrolmentService } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';
import {
  Roles,
  UserGuard,
  UserRole,
} from '@dsb-client-gateway/ddhub-client-gateway-user-roles';
import { EnrolmentDto } from '../identity/dto/identity-response.dto';
import { ResponseErrorDto } from '../utils/dto/response-error.dto';
import { SwaggerTags } from '../../../swagger/swagger.constants';

@Controller('enrol')
@ApiTags(SwaggerTags.ENROLMENT)
@UseGuards(UserGuard)
export class EnrolmentController {
  constructor(protected readonly enrolmentService: EnrolmentService) { }

  @Get()
  @ApiOperation({
    summary: 'Get the enrolment status of the gateway DID',
    description: [
      'Shows the roles of the gateway and their status.',
      '',
      '**Returns**',
      '- `roles`: a list of the gateway roles, each with its `status`: `NOT_ENROLLED`, `AWAITING_APPROVAL`, `APPROVED`, `REJECTED` or `SYNCED`.',
      '',
      '**Notes**',
      '- The gateway is ready when every required role is `SYNCED`.',
      '- Updated about once a minute.',
      '- Needs a configured identity, otherwise `500 DHCG::UNKNOWN`.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Enrolment of the gateway DID.',
    type: () => EnrolmentDto,
  })
  @Roles(UserRole.MESSAGING, UserRole.ADMIN, UserRole.SUPERADMIN)
  public async get(): Promise<Enrolment> {
    return this.enrolmentService.get();
  }

  @Post()
  @ApiOperation({
    summary: 'Start enrolment of the gateway DID',
    description: [
      'Requests the role the gateway needs.',
      '',
      '**Notes**',
      '- The gateway does this by itself; call it only to retry.',
      '- Needs a configured identity with funds.',
      '- Roles already requested, approved, rejected or synced are not requested again.',
      '- An issuer approves the request outside the gateway.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Enrolment started, or nothing to do because every required role is already `SYNCED`. Empty body.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'No identity configured (`ID::NO_PRIVATE_KEY`). Set one with `POST /api/v2/identity` first.',
    type: ResponseErrorDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: [
      'Returned as `DHCG::UNKNOWN` (see `err.reason`) for:',
      '- Zero balance: `Not enough balance. Address: 0x...`. Fund the address and retry.',
      '- SSI Hub or the blockchain could not be reached, or the role request was refused. Retry later.',
    ].join('\n'),
    type: ResponseErrorDto,
  })
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  public async init() {
    await this.enrolmentService.startListening();
  }
}
