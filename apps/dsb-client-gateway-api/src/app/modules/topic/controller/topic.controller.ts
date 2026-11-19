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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
import { ResponseErrorDto } from '../../utils/dto/response-error.dto';
import { SwaggerTags } from '../../../../swagger/swagger.constants';

const MB_400 =
  '- `MB::ERROR`: the message broker rejected the request (for example unknown topic id or version, owner or schema validation failed). `err.additionalDetails` holds `errorCode`, `errorCodeName` and `errorCodeMessage` from the broker.\n- `MB::UNKNOWN` / `MB::UNABLE_TO_LOGIN`: the message broker could not be reached or the gateway could not log in to it.';
const VALIDATION_400 =
  '- `VALIDATION::FAILED`: request validation failed, details in `err.additionalDetails.errors`.';

@Controller('topics')
@UseGuards(MtlsGuard, UserGuard)
@ApiTags(SwaggerTags.TOPICS)
export class TopicsController {
  constructor(
    protected readonly ddhubTopicsService: DdhubTopicsService,
    protected readonly topicService: TopicService
  ) { }

  @Get('')
  @ApiOperation({
    summary: 'List the topics of an application',
    description: [
      'Lists the topics of one application, each at its highest version.',
      '',
      '**Send**',
      '- `owner`: application namespace. Required.',
      '- `name`: optional, exact topic name.',
      '- `tags`: optional; a topic matches when one of its tags contains the given text.',
      '- `page`, `limit`: paging (default 5 per page).',
      '',
      '**Returns**',
      '- `records`: a list of topics, each with its schema.',
      '- `count`: number of matching topics across all pages.',
      '',
      '**Notes**',
      '- Covers the applications in which the gateway holds a role.',
      '- Changes made outside this gateway appear within about a minute.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'One page of topics (empty `records` when nothing matches or the gateway does not know the owner).',
    type: () => PaginatedResponse,
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
  @ApiOperation({
    summary: 'List the versions of a topic',
    description: [
      'Lists the versions of one topic.',
      '',
      '**Send**',
      '- `id`: topic id.',
      '- `page`, `limit`: paging (default 5 per page).',
      '',
      '**Returns**',
      '- `records`: a list of versions. Each has `version`, `name`, `owner`, `schemaType` and `tags`, without the schema.',
      '- `count`: number of versions across all pages.',
      '- `count: 0` for an unknown id.',
      '',
      '**Notes**',
      '- The order of the records is not guaranteed.',
      '- Changes made outside this gateway appear within about a minute.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'One page of versions of the topic.',
    type: () => PaginatedTopicResponse,
  })
  @Roles(UserRole.ADMIN, UserRole.MESSAGING)
  public async getTopicsHistoryById(
    @Param() { id }: GetTopicsParamsDto,
    @Query() { limit, page }: GetTopicsWithLimitParamsDto
  ): Promise<PaginatedTopicResponse> {
    return this.topicService.getTopicHistoryById(id, limit, page);
  }

  @Get('/:id/versions/:versionNumber')
  @ApiOperation({
    summary: 'Get one version of a topic, with its schema',
    description: [
      'Gets one topic version with its schema.',
      '',
      '**Send**',
      '- `id` and `versionNumber` (`MAJOR.MINOR.PATCH`).',
      '',
      '**Returns**',
      '- The version, with `schema` as a JSON string (parse it before use).',
      '',
      '**Notes**',
      '- `TOPIC::NOT_FOUND` means the version does not exist.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The topic version with its schema.',
    type: () => PostTopicDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: () => ResponseErrorDto,
    description: `\`err.code\`:
${VALIDATION_400} (for example \`versionNumber\` not in \`MAJOR.MINOR.PATCH\` form)
- \`TOPIC::NOT_FOUND\`: this gateway does not know this topic id and version (\`err.additionalDetails\` holds \`topicId\` and \`version\`).`,
  })
  @Roles(UserRole.ADMIN, UserRole.MESSAGING)
  public async getTopicHistoryByIdAndVersion(
    @Param() { id, versionNumber }: TopicsByIdAndVersionParamsDto
  ): Promise<PostTopicDto> {
    return this.topicService.getTopicHistoryByIdAndVersion(id, versionNumber);
  }

  @Get('/count')
  @ApiOperation({
    summary: 'Count topics per application namespace',
    description: [
      'Counts the topics of one or more applications.',
      '',
      '**Send**',
      '- `owner`: application namespace. Repeat it for several (`?owner=a&owner=b`).',
      '',
      '**Returns**',
      '- A list of owners, each with its number of topics.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A list of the requested owners, each with its number of topics.',
    type: [TopicCountDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: () => ResponseErrorDto,
    description: `\`err.code\`:
${VALIDATION_400} (\`owner\` missing or not a valid namespace)
${MB_400}`,
  })
  @Roles(UserRole.ADMIN, UserRole.MESSAGING)
  public async getTopicsCountByOwner(
    @Query() { owner }: GetTopicsCountQueryDto
  ): Promise<TopicCountDto[]> {
    return this.ddhubTopicsService.getTopicsCountByOwner(owner);
  }

  @Get('/search')
  @ApiOperation({
    summary: 'Search topics by name',
    description: [
      'Searches topics by name.',
      '',
      '**Send**',
      '- `keyword`: text to find in topic names (`%` and `_` act as wildcards).',
      '- `owner`: optional application namespace.',
      '- `page`, `limit`: paging (default 5 per page).',
      '',
      '**Returns**',
      '- `records`: a list of matching topics, each at its highest version, with its schema.',
      '- `count`: number of matching topics across all pages.',
      '',
      '**Notes**',
      '- Covers the applications in which the gateway holds a role.',
      '- Changes made outside this gateway appear within about a minute.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'One page of matching topics.',
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
  @ApiOperation({
    summary: 'Create a topic',
    description: [
      'Creates a topic with its first version.',
      '',
      '**Send**',
      '- `name`: unique within `owner`.',
      '- `owner`: application namespace.',
      '- `schemaType`: `JSD7` or `XML` for `pub` and `sub` channels; `XSD6`, `CSV` or `TSV` for `upload` and `download`. Cannot be changed later.',
      '- `version`: first version (`MAJOR.MINOR.PATCH`).',
      '- `schema` and `tags`.',
      '',
      '**Returns**',
      '- The new topic, including its `id`.',
      '',
      '**Notes**',
      '- On an error, check whether the topic was created before retrying; it can take up to a minute to appear.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Topic created. Returns the new topic, including its `id`.',
    type: () => PostTopicDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: () => ResponseErrorDto,
    description: `\`err.code\`:
${VALIDATION_400}
${MB_400}`,
  })
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  public async postTopics(
    @Body() data: PostTopicBodyDto
  ): Promise<PostTopicDto> {
    const result = await this.ddhubTopicsService.postTopics(data);

    await this.topicService.saveTopic(result);

    return result;
  }

  @Put('/:id/versions/:versionNumber')
  @ApiOperation({
    summary: 'Create or overwrite a version of a topic',
    description: [
      'Creates a new version of a topic, or replaces the schema of an existing version.',
      '',
      '**Send**',
      '- `id` and `versionNumber` (`MAJOR.MINOR.PATCH`).',
      '- `schema`: the schema of the version.',
      '',
      '**Returns**',
      '- The created or updated version.',
      '',
      '**Notes**',
      '- A new version keeps the name, owner, schema type and tags of the topic.',
      '- Replacing an existing schema affects everyone using that version; prefer a new version for incompatible changes.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The created or updated topic version.',
    type: () => PostTopicDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: () => ResponseErrorDto,
    description: `\`err.code\`:
${VALIDATION_400}
${MB_400}`,
  })
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
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
  @ApiOperation({
    summary: 'Replace the tags of a topic',
    description: [
      'Replaces the tags of a topic.',
      '',
      '**Send**',
      '- `id` and `tags`: the full new list (`[]` removes all tags).',
      '',
      '**Returns**',
      '- The topic with its new tags.',
      '',
      '**Notes**',
      '- Tags apply to all versions.',
      '- Name, owner and schema type cannot be changed.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The topic with its new tags.',
    type: () => PutTopicDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: () => ResponseErrorDto,
    description: `\`err.code\`:
${VALIDATION_400}
${MB_400}`,
  })
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
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
  @ApiOperation({
    summary: 'Delete a topic and all its versions',
    description: [
      'Deletes a topic and all its versions.',
      '',
      '**Notes**',
      '- Messages can no longer be sent on the topic.',
      '- Channels still list it for up to a minute.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Confirmation of the deletion.',
    type: () => DeleteTopic,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: () => ResponseErrorDto,
    description: `\`err.code\`:
${VALIDATION_400}
${MB_400}`,
  })
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
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
  @ApiOperation({
    summary: 'Delete one version of a topic',
    description: [
      'Deletes one version of a topic.',
      '',
      '**Send**',
      '- `id` and `versionNumber`.',
      '',
      '**Notes**',
      '- Other versions and the topic itself remain.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Confirmation of the deletion.',
    type: () => DeleteTopic,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: () => ResponseErrorDto,
    description: `\`err.code\`:
${VALIDATION_400} (for example \`versionNumber\` not in \`MAJOR.MINOR.PATCH\` form)
${MB_400}`,
  })
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
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
