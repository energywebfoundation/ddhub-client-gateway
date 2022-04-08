import {
  Controller,
  Get,
  UseGuards,
  Body,
  Post,
  Query,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { DsbApiService } from '../../dsb-client/service/dsb-api.service';
import { DigestGuard } from '../../utils/guards/digest.guard';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  GetTopicsCountQueryDto,
  PaginatedResponse,
  TopicsCountResponse,
  Topic,
  SendTopicBodyDto,
  GetTopicsQueryDto,
} from '../dto';

@Controller('topics')
@UseGuards(DigestGuard)
@ApiTags('Topics')
export class TopicsController {
  constructor(protected readonly dsbClientService: DsbApiService) {}

  @Get('')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Topics List',
    type: () => PaginatedResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public async getTopics(@Query() { owner }: GetTopicsQueryDto) {
    return this.dsbClientService.getTopics(owner);
  }

  @Get('/count')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Topics Count by Owner',
    type: () => TopicsCountResponse,
  })
  public async getTopicsCountByOwner(
    @Query() { owner }: GetTopicsCountQueryDto
  ) {
    return this.dsbClientService.getTopicsCountByOwner(owner);
  }

  @Post('')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Topic successfully created',
    type: () => Topic,
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
  public async postTopics(@Body() data: SendTopicBodyDto) {
    return this.dsbClientService.postTopics(data);
  }

  @Put('/')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Topic updated successfully',
    type: () => Topic,
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
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Topic not found',
  })
  @HttpCode(HttpStatus.OK)
  public async updateTopics(@Body() data: SendTopicBodyDto) {
    return this.dsbClientService.updateTopics(data);
  }
}
