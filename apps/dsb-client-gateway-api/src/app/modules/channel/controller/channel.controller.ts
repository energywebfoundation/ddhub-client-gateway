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
import { ChannelDidCacheService } from '../service/channel-did-cache.service';
import { ChannelEntity } from '../entity/channel.entity';

@Controller('channel')
@ApiTags('internal-channels')
@UseInterceptors(LokiMetadataStripInterceptor)
export class ChannelController {
  constructor(
    protected readonly channelService: ChannelService,
    protected readonly channelDidCacheService: ChannelDidCacheService
  ) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Channel successfully created',
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
  ): Promise<void> {
    await this.channelService.createChannel(dto);
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
    return this.channelService.getChannelQualifiedDids(fqcn);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gives channels based on type from query',
    type: () => [ChannelEntity],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public async getByType(
    @Query() query: GetChannelByTypeQueryDto
  ): Promise<ChannelEntity[]> {
    return this.channelService.getChannelsByType(query.type);
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
    await this.channelService.deleteChannelOrThrow(fqcn);
  }

  @Put()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Channel successfully updated',
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
  public async update(@Body() dto: CreateChannelDto): Promise<void> {
    await this.channelService.updateChannel(dto);
  }

  @Post('refresh')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refreshed cache',
    type: null,
  })
  @HttpCode(HttpStatus.OK)
  public async refreshDID(): Promise<void> {
    await this.channelDidCacheService.refreshChannelCache();
  }
}
