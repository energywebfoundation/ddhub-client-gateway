import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
import { ResponseErrorDto } from '../utils/dto/response-error.dto';
import { SwaggerTags } from '../../../swagger/swagger.constants';

@Controller('keys')
@ApiTags(SwaggerTags.KEYS)
@UseGuards(UserGuard)
export class KeysController {
  constructor(
    protected readonly associationKeysService: AssociationKeysService,
    protected readonly commandBus: CommandBus
  ) { }

  @Post('/association')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Generate the current and next association keys',
    description: [
      'Creates the current and the next association key, if they are missing.',
      '',
      '**Notes**',
      '- Association keys let other parties send messages to this gateway on anonymous external channels. Each is valid for `ASSOCIATION_KEY_INTERVAL` hours (default 24).',
      '- Existing keys are kept.',
      '- If a key cannot be registered with the Message Broker, the request still succeeds and the key shows `isSent: false`.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Current and next keys exist (created if missing). Empty body.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: [
      '- `IAM::NOT_INITIALIZED`: no gateway identity configured yet (`POST /api/v2/identity`).',
      '- `BIP39::MNEMONIC_DOES_NOT_EXISTS`: the mnemonic is missing (it is created at start-up; restart the API if it was removed).',
    ].join('\n'),
    type: ResponseErrorDto,
  })
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  public async forceGeneration(): Promise<void> {
    await this.associationKeysService.derivePublicKeys();
  }

  @Get('/association')
  @ApiOperation({
    summary: 'List all stored association keys',
    description: [
      'Lists all association keys of this gateway.',
      '',
      '**Returns**',
      '- A list of past, current and future keys, newest first. Each has its validity and registration state.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All stored association keys. Empty array if none were generated.',
    type: [GetAssociationKeysDto],
  })
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  public async getAssociationKeys(): Promise<GetAssociationKeysDto[]> {
    return this.associationKeysService.getAllKeys();
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/association/init')
  @ApiOperation({
    summary: 'Register the current association keys at the Message Broker',
    description: [
      'Registers the current and the next association key with the EWDS Message Broker again.',
      '',
      '**Notes**',
      '- Use it when keys show `isSent: false`.',
      '- Creates the keys first if they are missing.',
      '- Fails when the Message Broker cannot be reached.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Registration attempted for the current and upcoming keys. Empty body.',
  })
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  public async initAssociationKeys(): Promise<void> {
    await this.associationKeysService.initExternalChannels();
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/association/send')
  @ApiOperation({
    summary: 'Share the current association keys on the keys channel',
    description: [
      'Shares the current and the next association key as a message on the association keys channel.',
      '',
      '**Notes**',
      '- Needs `AK_FQCN`, `AK_TOPIC_NAME`, `AK_TOPIC_OWNER` and `AK_TOPIC_VERSION` to be set.',
      '- Nothing is sent when a setting is missing, the channel or topic is unknown, or there are no keys.',
      '- Always returns `204`: send errors are not reported. Check `isShared` on the keys.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description:
      'Keys sent, or there was nothing to send. Empty body.',
  })
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  public async sendAssociationKeys(): Promise<void> {
    await this.commandBus.execute(new ForceAssociationKeysRunCommand());
  }

  @ApiOperation({
    summary: 'Get the current and next association key',
    description: [
      'Gets the association key valid now and the next one.',
      '',
      '**Returns**',
      '- `current` and `next` (`next` usually equals `current`).',
      '- Both null when no key could be created.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Current and next association key.',
    type: GetCurrentKeyDto,
  })
  @Get('/association/current')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  public async getCurrentAssociationKey(): Promise<GetCurrentKeyDto> {
    return this.associationKeysService.getCurrentAndNext();
  }
}
