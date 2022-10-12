import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ClientsService } from '@dsb-client-gateway/ddhub-client-gateway-clients';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAllClientsResponseDto } from '../dto/get-all.dto';
import { DeleteClientParamsDto } from '../dto/delete.dto';
import { DeleteManyClientsBodyDto } from '../dto/delete-many.dto';

@Controller('clients')
@ApiTags('Clients')
export class ClientController {
  constructor(protected readonly clientsService: ClientsService) {}

  @Get('/')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of clients',
    type: [GetAllClientsResponseDto],
  })
  public async getAll(): Promise<GetAllClientsResponseDto[]> {
    return this.clientsService.getAll();
  }

  @Delete('/:clientId')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Client deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @Param() { clientId }: DeleteClientParamsDto
  ): Promise<void> {
    await this.clientsService.delete(clientId);
  }

  @Delete('/')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Clients deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteAll(
    @Body() { clientsIds }: DeleteManyClientsBodyDto
  ): Promise<void> {
    await this.clientsService.deleteMany(clientsIds);
  }
}
