import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ClientsService } from '@dsb-client-gateway/ddhub-client-gateway-clients';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAllClientsResponseDto } from '../dto/get-all.dto';
import { DeleteClientParamsDto } from '../dto/delete.dto';
import { DeleteManyClientsBodyDto } from '../dto/delete-many.dto';
import {
  Roles,
  UserGuard,
  UserRole,
} from '@dsb-client-gateway/ddhub-client-gateway-user-roles';
import { SwaggerTags } from '../../../../swagger/swagger.constants';

// Shared by both delete operations.
@Controller('clients')
@ApiTags(SwaggerTags.CLIENTS)
@UseGuards(UserGuard)
export class ClientController {
  constructor(protected readonly clientsService: ClientsService) { }

  @Get('/')
  @ApiOperation({
    summary: 'List registered client ids',
    description: [
      'Lists the client ids of this gateway.',
      '',
      '**Returns**',
      '- A list of client ids. Each has when it was created and last used.',
      '',
      '**Notes**',
      '- Client ids are added when messages are fetched, or a WebSocket connects, with a `clientId`.',
      '- The Message Broker limits how many a gateway can have (`MESSAGING:MAXIMUM_NUMBER_OF_CLIENTS_REACHED`).',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All registered client ids. Empty array when there are none.',
    type: [GetAllClientsResponseDto],
  })
  @Roles(UserRole.ADMIN, UserRole.MESSAGING)
  public async getAll(): Promise<GetAllClientsResponseDto[]> {
    return this.clientsService.getAll();
  }

  @Delete('/:clientId')
  @ApiOperation({
    summary: 'Delete one client id',
    description: [
      'Deletes one client id.',
      '',
      '**Notes**',
      '- An unknown id is ignored.',
      '- A deleted id comes back when it is used again.',
      '- Unused ids are deleted after `CLIENT_EXPIRATION_DAYS` days (default 30).',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Client id deleted (or did not exist). No body.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  public async delete(
    @Param() { clientId }: DeleteClientParamsDto
  ): Promise<void> {
    await this.clientsService.delete(clientId);
  }
// CI trigger api build
  @Delete('/')
  @ApiOperation({
    summary: 'Delete several client ids',
    description: [
      'Deletes several client ids.',
      '',
      '**Send**',
      '- `clientsIds`: the client ids to delete, as a JSON body on this `DELETE` request.',
      '',
      '**Notes**',
      '- Unknown ids are ignored.',
      '- A deleted id comes back when it is used again.',
      '- Unused ids are deleted after `CLIENT_EXPIRATION_DAYS` days (default 30).',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Client ids deleted (unknown ids are ignored). No body.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  public async deleteAll(
    @Body() { clientsIds }: DeleteManyClientsBodyDto
  ): Promise<void> {
    await this.clientsService.deleteMany(clientsIds);
  }
}
