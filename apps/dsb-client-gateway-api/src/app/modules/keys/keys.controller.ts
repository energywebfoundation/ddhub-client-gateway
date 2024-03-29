import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AssociationKeysService } from '@dsb-client-gateway/ddhub-client-gateway-association-keys';
import { GetAssociationKeysDto } from './dto/get-association-keys.dto';
import { GetCurrentKeyDto } from './dto/get-current-key.dto';
import { CommandBus } from '@nestjs/cqrs';
import { ForceAssociationKeysRunCommand } from '../message/command/force-association-keys-run.command';
import {
  Roles,
  UserGuard,
  UserRole,
} from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

@Controller('keys')
@ApiTags('Keys configuration')
@UseGuards(UserGuard)
export class KeysController {
  constructor(
    protected readonly associationKeysService: AssociationKeysService,
    protected readonly commandBus: CommandBus
  ) {}

  @Post('/association')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Successfully created association keys',
  })
  @Roles(UserRole.ADMIN)
  public async forceGeneration(): Promise<void> {
    await this.associationKeysService.derivePublicKeys();
  }

  @Get('/association')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of association keys',
    type: [GetAssociationKeysDto],
  })
  @Roles(UserRole.ADMIN)
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
  @Roles(UserRole.ADMIN)
  public async initAssociationKeys(): Promise<void> {
    await this.associationKeysService.initExternalChannels();
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/association/send')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Force sharing association keys',
  })
  @Roles(UserRole.ADMIN)
  public async sendAssociationKeys(): Promise<void> {
    await this.commandBus.execute(new ForceAssociationKeysRunCommand());
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of current and future association key',
    type: GetCurrentKeyDto,
  })
  @Get('/association/current')
  @Roles(UserRole.ADMIN)
  public async getCurrentAssociationKey(): Promise<GetCurrentKeyDto> {
    return this.associationKeysService.getCurrentAndNext();
  }
}
