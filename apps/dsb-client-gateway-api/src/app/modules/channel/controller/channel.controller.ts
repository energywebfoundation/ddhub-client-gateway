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
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateChannelDto } from '../dto/request/create-channel.dto';
import { ChannelValidationPipe } from '../pipes/channel-validation.pipe';
import { ChannelService } from '../service/channel.service';
import {
  CountChannelMessagesQueryDto,
  GetChannelByTypeQueryDto,
  GetChannelParamsDto,
  GetChannelQualifiedDidsParamsDto,
} from '../dto/request/get-channel.dto';
import {
  GetChannelQualifiedDidsDto,
  GetChannelResponseDto,
} from '../dto/response/get-channel.dto';
import { LokiMetadataStripInterceptor } from '../../utils/interceptors/loki-metadata-strip.interceptor';
import { UpdateChannelDto } from '../dto/request/update-channel.dto';
import { CommandBus } from '@nestjs/cqrs';
import { RefreshAllChannelsCacheDataCommand } from '../command/refresh-all-channels-cache-data.command';
import { ChannelEntity } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { MtlsGuard } from '../../certificate/guards/mtls.guard';
import { PinoLogger } from 'nestjs-pino';
import { GetChannelMessagesCountDto } from '../dto/request/get-channel-messages-count.dto';
import {
  Roles,
  UserGuard,
  UserRole,
} from '@dsb-client-gateway/ddhub-client-gateway-user-roles';
import { ResponseErrorDto } from '../../utils/dto/response-error.dto';
import { SwaggerTags } from '../../../../swagger/swagger.constants';
import {
  FQCN_EXAMPLE,
  FQCN_PARAM_DESCRIPTION,
} from '../dto/channel-swagger.docs';

const CHANNEL_NOT_FOUND_400 =
  '- `CHANNEL::NOT_FOUND`: no channel with this FQCN exists in this gateway (note: returned as 400, not 404).';
const VALIDATION_400 =
  '- `VALIDATION::FAILED`: request validation failed, details in `err.additionalDetails.errors`.';
const MB_400 =
  '- `MB::ERROR` / `MB::UNKNOWN`: the message broker rejected or could not answer a topic or role lookup; the upstream reason is in `err.additionalDetails`.';

@Controller('channels')
@ApiTags(SwaggerTags.CHANNELS)
@UseInterceptors(LokiMetadataStripInterceptor)
@UseGuards(MtlsGuard, UserGuard)
export class ChannelController {
  constructor(
    protected readonly channelService: ChannelService,
    protected readonly commandbus: CommandBus,
    protected readonly logger: PinoLogger
  ) { }

  @Get('/messages/count')
  @Roles(UserRole.MESSAGING, UserRole.ADMIN, UserRole.SUPERADMIN)
  @ApiOperation({
    summary: 'Count locally stored messages of all message-forms channels',
    description: [
      'Counts the stored messages of each channel with message forms enabled.',
      '',
      '**Send** (optional filters)',
      '- `type`, `useAnonymousExtChannel`, `payloadEncryption`.',
      '',
      '**Returns**',
      '- A list of channels, each with its message count: sent messages for `pub`; received messages for `sub`, `upload` and `download`.',
      '- An empty list when no channel matches.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'A list of matching channels with message forms enabled, each with its count. Empty if none match.',
    type: () => GetChannelMessagesCountDto,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  public async getCountOfChannels(
    @Query() query: CountChannelMessagesQueryDto
  ): Promise<GetChannelMessagesCountDto[]> {
    return this.channelService.getMultipleChannelsMessageCount({
      ...query,
      messageForms: true,
    });
  }

  @Get('/messages/count/:fqcn')
  @ApiOperation({
    summary: 'Count locally stored messages of one channel',
    description: [
      'Counts the stored messages of one channel.',
      '',
      '**Send**',
      '- `fqcn` of a channel with message forms enabled.',
      '',
      '**Returns**',
      '- Sent messages for a `pub` channel; received messages for other types.',
      '',
      '**Notes**',
      '- `CHANNEL::MESSAGE_FORMS_ONLY` when message forms are off for the channel.',
    ].join('\n'),
  })
  @ApiParam({
    name: 'fqcn',
    description: FQCN_PARAM_DESCRIPTION,
    example: FQCN_EXAMPLE,
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Number of stored messages of the channel.',
    type: () => GetChannelMessagesCountDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: () => ResponseErrorDto,
    description: `The count cannot be returned. \`err.code\`:
${CHANNEL_NOT_FOUND_400}
- \`CHANNEL::MESSAGE_FORMS_ONLY\`: the channel has \`messageForms = false\`, so no messages are stored for it.`,
  })
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.MESSAGING, UserRole.ADMIN, UserRole.SUPERADMIN)
  public async getCount(
    @Param('fqcn') fqcn: string
  ): Promise<GetChannelMessagesCountDto> {
    const amountOfMessages: number =
      await this.channelService.getChannelMessageCount(fqcn);

    return {
      count: amountOfMessages,
      fqcn: fqcn,
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Create a channel',
    description: [
      'Creates a channel: which topics, in which direction, and with which DIDs or roles.',
      '',
      '**Send**',
      '- `fqcn`: unique name (lowercase letters, digits and dots).',
      '- `type`: `pub`, `sub`, `upload` or `download`.',
      '- `conditions.topics`: topics that exist on the Message Broker; their schema type must fit the channel type.',
      '- `conditions.dids`, `conditions.roles`: who can exchange data on the channel.',
      '- `payloadEncryption`, `messageForms`, `useAnonymousExtChannel`.',
      '',
      '**Returns**',
      '- The created channel.',
      '',
      '**Notes**',
      '- Send `conditions` and `conditions.topics` even when empty (`[]`).',
      '- `type`, `useAnonymousExtChannel` and `messageForms` cannot be changed later.',
      '- Recipients (`qualifiedDids`) are updated about once a minute.',
      '- On an error, check whether the channel was created before retrying.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'The created channel.',
    type: () => GetChannelResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: () => ResponseErrorDto,
    description: `The channel could not be created. \`err.code\`:
${VALIDATION_400}
- \`CHANNEL::ALREADY_EXISTS\`: a channel with this FQCN already exists.
- \`TOPIC::NOT_FOUND\`: a topic name/owner pair was not found (or not uniquely) on the message broker, or this gateway does not know a \`responseTopicId\`. \`err.reason\` lists the missing topics.
- \`CHANNEL::CHANNEL_TOPIC_SCHEMA_TYPE_INVALID\`: a topic schema type does not fit the channel type; \`err.additionalDetails.topicId\` names it.
${MB_400}`,
  })
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  public async create(
    @Body(ChannelValidationPipe) dto: CreateChannelDto
  ): Promise<ChannelEntity> {
    this.logger.assign({
      fqcn: dto.fqcn,
    });

    await this.channelService.createChannel(dto);

    return this.channelService.getChannelOrThrow(dto.fqcn);
  }

  @Get('/:fqcn')
  @ApiOperation({
    summary: 'Get a channel',
    description: [
      'Gets the configuration of one channel.',
      '',
      '**Returns**',
      '- Type, settings, conditions, topics, `qualifiedDids` and timestamps.',
      '',
      '**Notes**',
      '- `qualifiedDids` is updated about once a minute.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The channel.',
    type: () => GetChannelResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: () => ResponseErrorDto,
    description: `\`err.code\`:
${VALIDATION_400} (FQCN format)
${CHANNEL_NOT_FOUND_400}`,
  })
  @Roles(UserRole.MESSAGING, UserRole.ADMIN, UserRole.SUPERADMIN)
  public async get(
    @Param() { fqcn }: GetChannelParamsDto
  ): Promise<GetChannelResponseDto> {
    this.logger.assign({
      fqcn,
    });

    return this.channelService.getChannelOrThrow(fqcn);
  }

  @Get('/:fqcn/qualifiedDids')
  @ApiOperation({
    summary: 'Get the qualified DIDs of a channel',
    description: [
      'Lists the DIDs allowed on a channel.',
      '',
      '**Returns**',
      '- `qualifiedDids`: the listed DIDs plus the holders of the listed roles. For `pub` and `upload` channels these are the recipients.',
      '',
      '**Notes**',
      '- Updated when the channel changes, and about once a minute after that.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Qualified DIDs of the channel.',
    type: () => GetChannelQualifiedDidsDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: () => ResponseErrorDto,
    description: `\`err.code\`:
${VALIDATION_400} (FQCN format)
${CHANNEL_NOT_FOUND_400}`,
  })
  @Roles(UserRole.MESSAGING, UserRole.ADMIN, UserRole.SUPERADMIN)
  public async getQualifiedDids(
    @Param() { fqcn }: GetChannelQualifiedDidsParamsDto
  ): Promise<GetChannelQualifiedDidsDto> {
    this.logger.assign({
      fqcn,
    });

    return this.channelService.getChannelQualifiedDids(fqcn);
  }

  @Get()
  @ApiOperation({
    summary: 'List channels',
    description: [
      'Lists the channels of this gateway.',
      '',
      '**Send** (optional filters)',
      '- `type`, `payloadEncryption`, `messageForms`, `useAnonymousExtChannel`.',
      '',
      '**Returns**',
      '- A list of all matching channels, not paged.',
      '',
      '**Notes**',
      '- `?messageForms=false` is read as `true`; send an empty value (`?messageForms=`) to filter on `false`. The same applies to the other true/false filters.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Matching channels (empty array when none match).',
    type: [GetChannelResponseDto],
  })
  @Roles(UserRole.MESSAGING, UserRole.ADMIN, UserRole.SUPERADMIN)
  public async getByType(
    @Query() query: GetChannelByTypeQueryDto
  ): Promise<GetChannelResponseDto[]> {
    this.logger.assign({
      type: query.type,
      useAnonymousExtChannel: query.useAnonymousExtChannel,
      messageForms: query.messageForms,
      payloadEncryption: query.payloadEncryption,
    });

    return this.channelService.queryChannels({
      type: query.type,
      useAnonymousExtChannel: query.useAnonymousExtChannel,
      messageForms: query.messageForms,
      payloadEncryption: query.payloadEncryption,
    });
  }

  @Delete('/:fqcn')
  @ApiOperation({
    summary: 'Delete a channel',
    description: [
      'Deletes a channel.',
      '',
      '**Notes**',
      '- Messages already stored for it stay listed.',
      '- Nothing changes on the Message Broker.',
      '- Cannot be undone.',
    ].join('\n'),
  })
  @ApiNoContentResponse({
    description: 'Channel deleted. No response body.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: () => ResponseErrorDto,
    description: `\`err.code\`:
${VALIDATION_400} (FQCN format)
${CHANNEL_NOT_FOUND_400}`,
  })
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  public async delete(@Param() { fqcn }: GetChannelParamsDto): Promise<void> {
    this.logger.assign({
      type: fqcn,
    });

    await this.channelService.deleteChannelOrThrow(fqcn);
  }

  @Put('/:fqcn')
  @ApiOperation({
    summary: 'Update a channel',
    description: [
      'Updates the encryption setting and the conditions of a channel.',
      '',
      '**Send**',
      '- `type`: must equal the current type.',
      '- `payloadEncryption`: the new value.',
      '- `conditions` (`dids`, `roles`, `topics`, `responseTopics`): full lists that replace the current ones.',
      '',
      '**Returns**',
      '- The updated channel.',
      '',
      '**Notes**',
      '- `useAnonymousExtChannel`: omit it or send the current value.',
      '- `messageForms` is ignored.',
      '- Send `conditions`, `topics` and `responseTopics` even when empty (`[]`).',
      '- On an error, check whether the change was saved before retrying.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'The updated channel.',
    type: () => GetChannelResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: () => ResponseErrorDto,
    description: `The channel could not be updated. \`err.code\`:
${VALIDATION_400}
${CHANNEL_NOT_FOUND_400}
- \`CHANNEL::RESTRICTED_FIELDS_UPDATE\`: \`type\` differs from the current type, or \`useAnonymousExtChannel\` is sent with a different value.
- \`TOPIC::NOT_FOUND\`: a topic name/owner pair was not found (or not uniquely) on the message broker, or this gateway does not know a \`responseTopicId\`.
- \`CHANNEL::CHANNEL_TOPIC_SCHEMA_TYPE_INVALID\`: a topic schema type does not fit the channel type.
${MB_400}`,
  })
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  public async update(
    @Body() dto: UpdateChannelDto,
    @Param() { fqcn }: GetChannelParamsDto
  ): Promise<ChannelEntity> {
    this.logger.assign({
      type: fqcn,
    });

    await this.channelService.updateChannel(dto, fqcn);

    return this.channelService.getChannelOrThrow(fqcn);
  }

  @Post('refresh')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @ApiOperation({
    summary: 'Refresh qualified DIDs and topics of all channels',
    description: [
      'Updates the recipients and topics of every channel now.',
      '',
      '**Notes**',
      '- This also happens automatically about once a minute.',
      '- Use it after roles were granted or revoked, or after topics changed.',
      '- A channel that cannot be updated is skipped.',
      '- Nothing is updated until the gateway identity is set up.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refresh finished. Empty body.',
  })
  @HttpCode(HttpStatus.OK)
  public async refreshDID(): Promise<void> {
    await this.commandbus.execute(new RefreshAllChannelsCacheDataCommand());
  }
}
