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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  DeleteTopic,
  DeleteTopicsVersionParamsDto,
  GetTopicsCountQueryDto,
  GetTopicsParamsDto,
  GetTopicsQueryDto,
  GetTopicsSearchQueryDto,
  GetTopicsWithLimitParamsDto,
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
import { MtlsGuard } from '../../certificate/guards/mtls.guard';
import {
  Roles,
  UserGuard,
  UserRole,
} from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

@Controller('topics')
@UseGuards(MtlsGuard, UserGuard)
@ApiTags('Topics')
export class TopicsController {
  constructor(
    protected readonly ddhubTopicsService: DdhubTopicsService,
    protected readonly topicService: TopicService
  ) {}

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
  @Roles(UserRole.ADMIN, UserRole.MESSAGING)
  public async getTopics(
    @Query() { name, owner, tags, limit, page }: GetTopicsQueryDto
  ) {
    return this.topicService.getTopics(
      +limit,
      name,
      owner,
      +page,
      typeof tags === 'string' ? [tags] : tags
    );
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
  @Roles(UserRole.ADMIN, UserRole.MESSAGING)
  public async getTopicsHistoryById(
    @Param() { id }: GetTopicsParamsDto,
    @Query() { limit, page }: GetTopicsWithLimitParamsDto
  ): Promise<PaginatedTopicResponse> {
    return this.topicService.getTopicHistoryById(id, limit, page);
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
  @Roles(UserRole.ADMIN, UserRole.MESSAGING)
  public async getTopicHistoryByIdAndVersion(
    @Param() { id, versionNumber }: TopicsByIdAndVersionParamsDto
  ): Promise<PostTopicDto> {
    return this.topicService.getTopicHistoryByIdAndVersion(id, versionNumber);
  }

  @Get('/count')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Topics Count by Owner',
    type: [TopicCountDto],
  })
  @Roles(UserRole.ADMIN, UserRole.MESSAGING)
  public async getTopicsCountByOwner(
    @Query() { owner }: GetTopicsCountQueryDto
  ): Promise<TopicCountDto[]> {
    return this.ddhubTopicsService.getTopicsCountByOwner(owner);
  }

  @Get('/search')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Topics by Search',
    type: () => PaginatedResponse,
  })
  @Roles(UserRole.ADMIN, UserRole.MESSAGING)
  public async getTopicsBySearch(
    @Query() { keyword, owner, limit, page }: GetTopicsSearchQueryDto
  ) {
    limit = limit ? limit : 5;
    page = page ? page : 1;

    return this.topicService.getTopicsBySearch(keyword, owner, limit, page);
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
  @Roles(UserRole.ADMIN)
  public async postTopics(
    @Body() data: PostTopicBodyDto
  ): Promise<PostTopicDto> {
    return this.ddhubTopicsService
      .postTopics(data)
      .then((topic: PostTopicDto) => {
        this.topicService.saveTopic(topic);
        return topic;
      });
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
  @Roles(UserRole.ADMIN)
  public async updateTopicsByIdAndVersion(
    @Param() { id, versionNumber }: TopicsByIdAndVersionParamsDto,
    @Body() data: UpdateTopicHistoryBodyDto
  ): Promise<PostTopicDto> {
    return this.ddhubTopicsService
      .updateTopicByIdAndVersion(data, id, versionNumber)
      .then((topic: PostTopicDto) => {
        this.topicService.updateTopicVersion(topic);
        return topic;
      });
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
  @Roles(UserRole.ADMIN)
  public async updateTopics(
    @Param() { id }: GetTopicsParamsDto,
    @Body() data: UpdateTopicBodyDto
  ): Promise<PutTopicDto> {
    return this.ddhubTopicsService
      .updateTopic(data, id)
      .then((topic: PostTopicDto) => {
        this.topicService.updateTopic(topic);
        return topic;
      });
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
  @Roles(UserRole.ADMIN)
  public async deleteTopics(
    @Param() { id }: GetTopicsParamsDto
  ): Promise<DeleteTopic> {
    return this.ddhubTopicsService
      .deleteTopic(id)
      .then((topic: DeleteTopic) => {
        this.topicService.deleteTopic(id, undefined);
        return topic;
      });
  }

  @Delete('/:id/versions/:versionNumber')
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
  @Roles(UserRole.ADMIN)
  public async deleteTopicsByVersion(
    @Param() { id, versionNumber }: DeleteTopicsVersionParamsDto
  ): Promise<DeleteTopic> {
    return this.ddhubTopicsService
      .deleteTopicByVersion(id, versionNumber)
      .then((topic: DeleteTopic) => {
        this.topicService.deleteTopic(id, versionNumber);
        return topic;
      });
  }
}
