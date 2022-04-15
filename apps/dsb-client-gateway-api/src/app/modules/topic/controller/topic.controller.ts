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
  Param,
  Delete,
} from '@nestjs/common';
import { DsbApiService } from '../../dsb-client/service/dsb-api.service';
import { DigestGuard } from '../../utils/guards/digest.guard';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  GetTopicsCountQueryDto,
  PaginatedResponse,
  TopicsCountResponse,
  GetTopicDto,
  UpdateTopicBodyDto,
  GetTopicsQueryDto,
  GetTopicsParamsDto,
  DeleteTopic,
  DeleteTopicsVersionParamsDto,
  TopicsByIdAndVersionParamsDto,
  UpdateTopicHistoryBodyDto,
  GetTopicsSearchQueryDto,
  PostTopicBodyDto,
  PostTopicDto,
  PaginatedSearchTopicResponse,
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
  public async getTopics(
    @Query() { limit, name, owner, page, tags }: GetTopicsQueryDto
  ) {
    return this.dsbClientService.getTopics(limit, name, owner, page, tags);
  }

  @Get('/:id/versions')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Topics List with same Id and different versions',
    type: () => PaginatedSearchTopicResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public async getTopicsHistoryById(@Param() { id }: GetTopicsParamsDto) {
    return this.dsbClientService.getTopicHistoryById(id);
  }

  @Get('/:id/versions/:versionNumber')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Topics History by Id and version',
    type: () => PostTopicDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public async getTopicHistoryByIdAndVersion(
    @Param() { id, versionNumber }: TopicsByIdAndVersionParamsDto
  ) {
    return this.dsbClientService.getTopicHistoryByIdAndVersion(
      id,
      versionNumber
    );
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

  @Get('/search')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Topics by Search',
    type: () => PaginatedSearchTopicResponse,
  })
  public async getTopicsBySearch(
    @Query() { keyword, limit, page }: GetTopicsSearchQueryDto
  ) {
    return this.dsbClientService.getTopicsBySearch(keyword, limit, page);
  }

  @Post('')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Topic successfully created',
    type: () => PostTopicDto,
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
  public async postTopics(@Body() data: PostTopicBodyDto) {
    return this.dsbClientService.postTopics(data);
  }

  @Put('/:id/versions/:versionNumber')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Topic updated successfully',
    type: () => PostTopicDto,
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
  public async updateTopicsByIdAndVersion(
    @Param() { id, versionNumber }: TopicsByIdAndVersionParamsDto,
    @Body() data: UpdateTopicHistoryBodyDto
  ) {
    return this.dsbClientService.updateTopicByIdAndVersion(
      data,
      id,
      versionNumber
    );
  }

  @Put('/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Topic updated successfully',
    type: () => PostTopicDto,
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
  public async updateTopics(
    @Param() { id }: GetTopicsParamsDto,
    @Body() data: UpdateTopicBodyDto
  ) {
    return this.dsbClientService.updateTopic(data, id);
  }

  @Delete('/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Topic deleted successfully',
    type: () => DeleteTopic,
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
  public async deleteTopics(@Param() { id }: GetTopicsParamsDto) {
    return this.dsbClientService.deleteTopic(id);
  }

  @Delete('/:id/versions/:version')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Topic deleted successfully',
    type: () => DeleteTopic,
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
  public async deleteTopicsByVersion(
    @Param() { id, version }: DeleteTopicsVersionParamsDto
  ) {
    return this.dsbClientService.deleteTopicByVersion(id, version);
  }
}
