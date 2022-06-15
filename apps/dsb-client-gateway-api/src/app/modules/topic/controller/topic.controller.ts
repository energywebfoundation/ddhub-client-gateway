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
} from '@nestjs/common';
import { DigestGuard } from '../../utils/guards/digest.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  DeleteTopic,
  DeleteTopicsVersionParamsDto,
  GetTopicsCountQueryDto,
  GetTopicsParamsDto,
  GetTopicsQueryDto,
  GetTopicsSearchQueryDto,
  PaginatedResponse,
  PaginatedTopicResponse,
  PostTopicBodyDto,
  PostTopicDto,
  PutTopicDto,
  TopicCountDto,
  TopicsByIdAndVersionParamsDto,
  UpdateTopicBodyDto,
  UpdateTopicHistoryBodyDto,
} from '../dto';
import { DdhubTopicsService } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { TopicService } from '../service/topic.service';

@Controller('topics')
@UseGuards(DigestGuard)
@ApiTags('Topics')
export class TopicsController {
  constructor(
    protected readonly ddhubTopicsService: DdhubTopicsService,
    protected readonly topicService: TopicService
  ) { }

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
    return this.topicService.getTopics(limit, name, owner, page, tags);
  }

  @Get('/:id/versions')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Topics List with same Id and different versions',
    type: () => PaginatedTopicResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public async getTopicsHistoryById(
    @Param() { id }: GetTopicsParamsDto
  ): Promise<PaginatedTopicResponse> {
    return this.ddhubTopicsService.getTopicHistoryById(id);
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
  ): Promise<PostTopicDto> {
    return this.ddhubTopicsService.getTopicHistoryByIdAndVersion(
      id,
      versionNumber
    );
  }

  @Get('/count')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Topics Count by Owner',
    type: [TopicCountDto],
  })
  public async getTopicsCountByOwner(
    @Query() { owner }: GetTopicsCountQueryDto
  ): Promise<TopicCountDto[]> {
    return this.ddhubTopicsService.getTopicsCountByOwner(owner);
  }

  @Get('/search')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Topics by Search',
    type: () => PaginatedTopicResponse,
  })
  public async getTopicsBySearch(
    @Query() { keyword, owner, limit, page }: GetTopicsSearchQueryDto
  ): Promise<PaginatedTopicResponse | []> {
    return this.ddhubTopicsService.getTopicsBySearch(keyword, owner, limit, page);
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
  public async postTopics(
    @Body() data: PostTopicBodyDto
  ): Promise<PostTopicDto> {
    return this.ddhubTopicsService.postTopics(data);
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
  ): Promise<PostTopicDto> {
    return this.ddhubTopicsService.updateTopicByIdAndVersion(
      data,
      id,
      versionNumber
    );
  }

  @Put('/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Topic updated successfully',
    type: () => PutTopicDto,
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
  ): Promise<PutTopicDto> {
    return this.ddhubTopicsService.updateTopic(data, id);
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
  public async deleteTopics(
    @Param() { id }: GetTopicsParamsDto
  ): Promise<DeleteTopic> {
    return this.ddhubTopicsService.deleteTopic(id);
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
  ): Promise<DeleteTopic> {
    return this.ddhubTopicsService.deleteTopicByVersion(id, version);
  }
}
