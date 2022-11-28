import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AssociationKeysService } from '@dsb-client-gateway/ddhub-client-gateway-association-keys';
import { GetAssociationKeysDto } from './dto/get-association-keys.dto';

@Controller('keys')
@ApiTags('Keys configuration')
export class KeysController {
  constructor(
    protected readonly associationKeysService: AssociationKeysService
  ) {}

  @Post('/association')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Successfully created association keys',
  })
  public async forceGeneration(): Promise<void> {
    await this.associationKeysService.derivePublicKeys();
  }

  @Get('/association')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of association keys',
    type: [GetAssociationKeysDto],
  })
  public async getAssociationKeys(): Promise<GetAssociationKeysDto[]> {
    return this.associationKeysService.getAllKeys();
  }
}
