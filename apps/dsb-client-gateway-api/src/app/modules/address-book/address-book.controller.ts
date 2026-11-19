import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddressBookService } from '@dsb-client-gateway/ddhub-client-gateway-address-book';
import { GetAllContactsResponseDto } from './dto/response/get-all-contacts-response.dto';
import { AddressBookEntity } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { CreateContactDto } from './dto/request/create-contact-request.dto';
import { UpdateContactRequestDto } from './dto/request/update-contact-request.dto';
import {
  Roles,
  UserGuard,
  UserRole,
} from '@dsb-client-gateway/ddhub-client-gateway-user-roles';
import { GetContactParamsDto } from './dto/request/get-contact.dto';
import { PinoLogger } from 'nestjs-pino';
import { ContactNotFoundException } from './exceptions/contact-not-found-exception';
import { ResponseErrorDto } from '../utils/dto/response-error.dto';
import { SwaggerTags } from '../../../swagger/swagger.constants';

// Path parameter of the update and delete operations. Unlike GET /contacts/{did}
// it is not validated, so no pattern is declared.
const UNVALIDATED_DID_PARAM = {
  name: 'did',
  description:
    'DID of the contact, matched exactly (case sensitive) against the stored DID. Not validated: a malformed or unknown DID simply matches nothing.',
  example: 'did:ethr:volta:0xfeFBb03EFc1054Cc4e3Fbf36362689cc1F5924a8',
};

const DUPLICATE_ALIAS_RESPONSE = {
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  type: ResponseErrorDto,
  description:
    'Returned with `err.code` `DHCG::UNKNOWN` when `alias` is already used by another contact. Also used for unexpected internal errors.',
};

@Controller('contacts')
@ApiTags(SwaggerTags.ADDRESS_BOOK)
@UseGuards(UserGuard)
export class AddressBookController {
  constructor(
    protected readonly addressBookService: AddressBookService,
    protected readonly logger: PinoLogger
  ) { }

  @Post()
  @ApiOperation({
    summary: 'Create or replace a contact',
    description: [
      'Saves a DID with a friendly name (alias).',
      '',
      '**Send**',
      '- `did` and `alias` (3 to 255 characters, unique).',
      '',
      '**Notes**',
      '- An existing contact with the same DID gets the new alias.',
      '- The DID itself is not checked.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Contact created, or alias of the existing contact replaced. No body.',
  })
  @ApiResponse(DUPLICATE_ALIAS_RESPONSE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  public async storeContact(@Body() dto: CreateContactDto): Promise<void> {
    await this.addressBookService.save(dto.did, dto.alias);
  }

  @Delete('/:did')
  @ApiOperation({
    summary: 'Delete a contact',
    description: [
      'Deletes a contact.',
      '',
      '**Notes**',
      '- Only the alias is removed; channels and messages are not affected.',
      '- An unknown DID is not an error.',
    ].join('\n'),
  })
  @ApiParam(UNVALIDATED_DID_PARAM)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Contact deleted (or did not exist). No body.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  public async deleteContact(@Param('did') did: string): Promise<void> {
    await this.addressBookService.delete(did);
  }

  @Put('/:did')
  @ApiOperation({
    summary: 'Rename a contact',
    description: [
      'Changes the alias of a contact.',
      '',
      '**Send**',
      '- `alias`: 3 to 255 characters, unique.',
      '',
      '**Notes**',
      '- For an unknown DID nothing changes, and the call still returns `204`.',
    ].join('\n'),
  })
  @ApiParam(UNVALIDATED_DID_PARAM)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Alias updated, or no contact with this DID exists. No body.',
  })
  @ApiResponse(DUPLICATE_ALIAS_RESPONSE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  public async updateContact(
    @Param('did') did: string,
    @Body() dto: UpdateContactRequestDto
  ): Promise<void> {
    await this.addressBookService.update(did, dto.alias);
  }

  @Get()
  @ApiOperation({
    summary: 'List all contacts',
    description: [
      'Lists all contacts.',
      '',
      '**Returns**',
      '- A list of all contacts, not paged. Each has its DID and alias.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All contacts. Empty array when the address book is empty.',
    type: [GetAllContactsResponseDto],
  })
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.MESSAGING)
  public async getAllContacts(): Promise<GetAllContactsResponseDto[]> {
    const allContacts: AddressBookEntity[] =
      await this.addressBookService.getAll();

    return allContacts.map((contact: AddressBookEntity) => ({
      did: contact.did,
      alias: contact.name,
    }));
  }

  @Get('/:did')
  @ApiOperation({
    summary: 'Get a contact by DID',
    description: [
      'Gets one contact.',
      '',
      '**Returns**',
      '- The DID and its alias.',
      '',
      '**Notes**',
      '- An unknown DID returns `400 CONTACT::NOT_FOUND`.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The contact.',
    type: GetAllContactsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ResponseErrorDto,
    description:
      'One of:\n' +
      '- `CONTACT::NOT_FOUND`: no contact with this DID exists (`err.additionalDetails.did` echoes the DID). Note that this is a 400, not a 404.\n' +
      '- `VALIDATION::FAILED`: request validation failed, here a malformed DID (`err.additionalDetails.errors` contains `Malformed DID`).',
  })
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.MESSAGING)
  public async get(
    @Param() { did }: GetContactParamsDto
  ): Promise<GetAllContactsResponseDto> {
    this.logger.assign({
      did,
    });

    const contact = await this.addressBookService.findContact(did);
    if (!contact) {
      throw new ContactNotFoundException(did);
    }
    return {
      did: contact.did,
      alias: contact.name,
    };
  }
}
