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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
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

@Controller('contacts')
@ApiTags('Address Book')
@UseGuards(UserGuard)
export class AddressBookController {
  constructor(
    protected readonly addressBookService: AddressBookService,
    protected readonly logger: PinoLogger
  ) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Contact created successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.ADMIN)
  public async storeContact(@Body() dto: CreateContactDto): Promise<void> {
    await this.addressBookService.save(dto.did, dto.alias);
  }

  @Delete('/:did')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Contact deleted successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.ADMIN)
  public async deleteContact(@Param('did') did: string): Promise<void> {
    await this.addressBookService.delete(did);
  }

  @Put('/:did')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Contact modified successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.ADMIN)
  public async updateContact(
    @Param('did') did: string,
    @Body() dto: UpdateContactRequestDto
  ): Promise<void> {
    await this.addressBookService.update(did, dto.alias);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of contacts',
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get contact by DID',
    type: [GetAllContactsResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Contact not found',
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
