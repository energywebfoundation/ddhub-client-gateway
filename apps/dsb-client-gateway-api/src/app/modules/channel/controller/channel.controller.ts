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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateChannelDto } from '../dto/request/create-channel.dto';
import { ChannelValidationPipe } from '../pipes/channel-validation.pipe';
import { ChannelService } from '../service/channel.service';
import {
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

@Controller('channels')
@ApiTags('Channels')
@UseInterceptors(LokiMetadataStripInterceptor)
@UseGuards(MtlsGuard)
export class ChannelController {
  constructor(
    protected readonly channelService: ChannelService,
    protected readonly commandbus: CommandBus,
    protected readonly logger: PinoLogger
  ) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Channel successfully created',
    type: () => ChannelEntity,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Validation failed or some requirements were not fully satisfied',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @HttpCode(HttpStatus.CREATED)
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Channel details',
    type: () => GetChannelResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Channel not found',
  })
  public async get(
    @Param() { fqcn }: GetChannelParamsDto
  ): Promise<GetChannelResponseDto> {
    this.logger.assign({
      fqcn,
    });

    return this.channelService.getChannelOrThrow(fqcn);
  }

  @Get('/:fqcn/qualifiedDids')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Channel qualified dids',
    type: () => GetChannelQualifiedDidsDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Channel not found',
  })
  public async getQualifiedDids(
    @Param() { fqcn }: GetChannelQualifiedDidsParamsDto
  ): Promise<GetChannelQualifiedDidsDto> {
    this.logger.assign({
      fqcn,
    });

    return this.channelService.getChannelQualifiedDids(fqcn);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gives channels based on type from query',
    type: [GetChannelResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
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
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Channel deleted',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Channel not found',
  })
  public async delete(@Param() { fqcn }: GetChannelParamsDto): Promise<void> {
    this.logger.assign({
      type: fqcn,
    });

    await this.channelService.deleteChannelOrThrow(fqcn);
  }

  @Put('/:fqcn')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Channel successfully updated',
    type: () => ChannelEntity,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Validation failed or some requirements were not fully satisfied',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @HttpCode(HttpStatus.OK)
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refreshed cache',
    type: null,
  })
  @HttpCode(HttpStatus.OK)
  public async refreshDID(): Promise<void> {
    await this.commandbus.execute(new RefreshAllChannelsCacheDataCommand());
  }
}
