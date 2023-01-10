import { Injectable, Logger } from '@nestjs/common';
import {
  TopicEntity,
  TopicRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { Span } from 'nestjs-otel';
import { GetTopicResponse } from '../entity/topic.entity';

import {
  GetTopicSearchDto,
  PaginatedTopicResponse,
  PostTopicDto,
} from '../dto';
import { SchemaType } from '../topic.const';
import { TopicOrVersionNotFoundException } from '../exceptions/topic-or-version-not-found.exception';

@Injectable()
export class TopicService {
  protected readonly logger = new Logger(TopicService.name);

  constructor(protected readonly wrapper: TopicRepositoryWrapper) {}

  public async getOne(
    name: string,
    owner: string
  ): Promise<TopicEntity | null> {
    return this.wrapper.topicRepository.getOne(name, owner);
  }

  @Span('topics_getTopic')
  public async getTopic(
    name: string,
    owner: string,
    version: string
  ): Promise<TopicEntity | null> {
    return this.wrapper.topicRepository.findOne({
      where: {
        name,
        owner,
        version,
      },
    });
  }

  @Span('topics_getTopics')
  public async getTopics(
    limit: number,
    name: string,
    owner: string,
    page: number,
    tags: string[]
  ): Promise<GetTopicResponse> {
    const topics: TopicEntity[] = await this.wrapper.topicRepository.getLatest(
      limit,
      name,
      owner,
      page,
      tags
    );

    const allCount: number =
      await this.wrapper.topicRepository.getCountOfLatest(name, owner, tags);

    return {
      limit,
      count: allCount,
      page,
      records: topics,
    };
  }

  @Span('topics_getTopicsBySearch')
  public async getTopicsBySearch(
    keyword: string,
    owner: string,
    limit: number,
    page: number
  ) {
    const topics = await this.wrapper.topicRepository.getTopicsAndCountSearch(
      limit,
      keyword,
      owner,
      page
    );

    const allCount = await this.wrapper.topicRepository.getTopicsCountSearch(
      keyword,
      owner
    );

    return {
      limit,
      count: allCount,
      page,
      records: topics,
    };
  }

  @Span('topics_saveTopic')
  public async saveTopic(data: PostTopicDto): Promise<void> {
    await this.wrapper.topicRepository.save({
      id: data.id,
      owner: data.owner,
      name: data.name,
      schemaType: data.schemaType,
      version: data.version,
      schema: data.schema as unknown as object,
      tags: data.tags,
    });
  }

  @Span('topics_updateTopic')
  public async updateTopic(data: PostTopicDto): Promise<void> {
    await this.wrapper.topicRepository.update(
      {
        id: data.id,
      },
      {
        ...(data.tags ? { tags: data.tags } : null),
      }
    );

    if (data.version)
      await this.wrapper.topicRepository.update(
        {
          id: data.id,
          version: data.version,
        },
        {
          ...(data.schema
            ? { schema: data.schema as unknown as object }
            : null),
        }
      );
  }

  @Span('topics_updateTopicVersion')
  public async updateTopicVersion(data: PostTopicDto): Promise<void> {
    const topic: TopicEntity = await this.wrapper.topicRepository.findOne({
      where: { id: data.id, version: data.version },
    });
    if (topic) {
      await this.updateTopic(data);
    } else {
      const [major, minor, patch]: string[] = data.version.split('.');

      await this.wrapper.topicRepository.save({
        id: data.id,
        owner: data.owner,
        name: data.name,
        schemaType: data.schemaType,
        version: data.version,
        schema: data.schema as unknown as object,
        tags: data.tags,
        majorVersion: major,
        minorVersion: minor,
        patchVersion: patch,
      });
    }
  }

  @Span('topics_deleteTopic')
  public async deleteTopic(id: string, versionNumber: string): Promise<void> {
    const data: TopicEntity = await this.wrapper.topicRepository.findOne({
      where: { id },
    });
    if (data) {
      await this.wrapper.topicRepository.delete({
        ...{ id },
        ...(versionNumber ? { version: versionNumber } : null),
      });
    }
  }

  public async getTopicHistoryByIdAndVersion(
    id: string,
    versionNumber: string
  ): Promise<PostTopicDto> {
    const topic: TopicEntity = await this.wrapper.topicRepository.findOne({
      where: { id, version: versionNumber },
    });

    if (!topic) {
      throw new TopicOrVersionNotFoundException(id, versionNumber);
    }

    return {
      id: topic.id,
      name: topic.name,
      schemaType: topic.schemaType as SchemaType,
      schema: JSON.stringify(topic.schema),
      version: topic.version,
      owner: topic.owner,
      tags: topic.tags,
    };
  }

  public async getTopicHistoryById(
    id: string,
    limit: number,
    page: number
  ): Promise<PaginatedTopicResponse> {
    const [topics, allCount] = await this.wrapper.topicRepository.findAndCount({
      where: { id },
      skip: (page - 1) * limit,
      take: limit,
    });

    const topicSearchDto: GetTopicSearchDto[] = topics.map((topic) => {
      const topicDto: GetTopicSearchDto = {
        id: topic.id,
        name: topic.name,
        schemaType: topic.schemaType as SchemaType,
        owner: topic.owner,
        tags: topic.tags,
        version: topic.version,
      };
      return topicDto;
    });

    return {
      count: allCount,
      limit: limit,
      page: page,
      records: topicSearchDto,
    };
  }
}
