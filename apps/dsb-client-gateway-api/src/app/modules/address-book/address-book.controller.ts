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
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddressBookService } from '@dsb-client-gateway/ddhub-client-gateway-address-book';
import { GetAllContactsResponseDto } from './dto/response/get-all-contacts-response.dto';
import { AddressBookEntity } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { CreateContactDto } from './dto/request/create-contact-request.dto';
import { UpdateContactRequestDto } from './dto/request/update-contact-request.dto';

@Controller('contacts')
@ApiTags('Address Book', 'Contacts')
export class AddressBookController {
  constructor(protected readonly addressBookService: AddressBookService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Contact created successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async storeContact(@Body() dto: CreateContactDto): Promise<void> {
    await this.addressBookService.save(dto.did, dto.alias);
  }

  @Delete('/:did')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Contact deleted successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteContact(@Param('did') did: string): Promise<void> {
    await this.addressBookService.delete(did);
  }

  @Put('/:did')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Contact modified successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
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
  public async getAllContacts(): Promise<GetAllContactsResponseDto[]> {
    const allContacts: AddressBookEntity[] =
      await this.addressBookService.getAll();

    return allContacts.map((contact: AddressBookEntity) => ({
      did: contact.did,
      alias: contact.name,
    }));
  }
}
