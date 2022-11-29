import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AssociationKeysService } from '@dsb-client-gateway/ddhub-client-gateway-association-keys';
import { GetAssociationKeysDto } from './dto/get-association-keys.dto';
import { AssociationKeyEntity } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { GetCurrentKeyDto } from './dto/get-current-key.dto';

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

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/association/init')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description:
      'Force initialization of external channel for current association keys',
  })
  public async initAssociationKeys(): Promise<void> {
    await this.associationKeysService.initExternalChannels();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of current and future association key',
    type: GetCurrentKeyDto,
  })
  @Get('/association/current')
  public async getCurrentAssociationKey(): Promise<GetCurrentKeyDto> {
    const currentKey: AssociationKeyEntity | null =
      await this.associationKeysService.getCurrentKey();

    const nextKey: AssociationKeyEntity | null = currentKey
      ? await this.associationKeysService.getForDate(currentKey.validTo)
      : null;

    return {
      current: currentKey,
      next: nextKey,
    };
  }
}
