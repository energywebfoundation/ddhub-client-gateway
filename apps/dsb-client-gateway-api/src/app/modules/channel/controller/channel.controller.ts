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
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateChannelDto } from '../dto/request/create-channel.dto';
import { ChannelValidationPipe } from '../pipes/channel-validation.pipe';
import { ChannelService } from '../service/channel.service';
import { GetChannelParamsDto } from '../dto/request/get-channel.dto';
import { GetChannelResponseDto } from '../dto/response/get-channel.dto';
import { LokiMetadataStripInterceptor } from '../../utils/interceptors/loki-metadata-strip.interceptor';

@Controller('channel')
@ApiTags('internal-channels')
@UseInterceptors(LokiMetadataStripInterceptor)
export class ChannelController {
  constructor(protected readonly channelService: ChannelService) {}

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

  @Get('/:channelName')
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
    @Param() { channelName }: GetChannelParamsDto
  ): Promise<GetChannelResponseDto> {
    return this.channelService.getChannelOrThrow(channelName);
  }

  @Delete('/:channelName')
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
  public async delete(
    @Param() { channelName }: GetChannelParamsDto
  ): Promise<void> {
    await this.channelService.deleteChannelOrThrow(channelName);
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
}
