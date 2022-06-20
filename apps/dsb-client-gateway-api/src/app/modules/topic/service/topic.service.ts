import { Injectable, Logger } from '@nestjs/common';
import {
  ApplicationWrapperRepository,
  TopicEntity,
  TopicRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { Span } from 'nestjs-otel';
import { GetTopicResponse } from '../entity/topic.entity';

import { PostTopicDto } from '../dto';
@Injectable()
export class TopicService {
  protected readonly logger = new Logger(TopicService.name);

  constructor(protected readonly wrapper: TopicRepositoryWrapper,
    protected readonly applicationsWrapper: ApplicationWrapperRepository) { }

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
  public async getTopicsBySearch(keyword: string, owner: string, limit: number, page: number) {
    const [topics, allCount] =
      await this.wrapper.topicRepository.getTopicsAndCountSearch(
        limit,
        keyword,
        owner,
        page
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
    await this.applicationsWrapper.repository.update({
      namespace: data.owner
    }, {
      topicsCount: () => "topicsCount + 1"
    });

    await this.wrapper.topicRepository.save({
      id: data.id,
      owner: data.owner,
      name: data.name,
      schemaType: data.schemaType,
      version: data.version,
      schema: (data.schema) as unknown as object,
      tags: data.tags,
    });
  }

  @Span('topics_updateTopic')
  public async updateTopic(data: PostTopicDto): Promise<void> {
    await this.wrapper.topicRepository.update({
      id: data.id,
    }, {
      ...(data.tags ? { tags: data.tags } : null),
      ...(data.schema ? { schema: (data.schema) as unknown as object } : null),
    });
  }

  @Span('topics_updateTopicVersion')
  public async updateTopicVersion(data: PostTopicDto): Promise<void> {
    const topic: TopicEntity = await this.wrapper.topicRepository.findOne({ where: { id: data.id, version: data.version } });
    if (topic) {
      this.updateTopic(data);
    } else {
      await this.wrapper.topicRepository.save({
        id: data.id,
        owner: data.owner,
        name: data.name,
        schemaType: data.schemaType,
        version: data.version,
        schema: (data.schema) as unknown as object,
        tags: data.tags,
      });
    }
  }

  @Span('topics_deleteTopic')
  public async deleteTopic(id: string, versionNumber: string): Promise<void> {
    const data: TopicEntity = await this.wrapper.topicRepository.findOne({ where: { id } });
    if (data) {
      await this.wrapper.topicRepository.delete({
        ...{ id },
        ...(versionNumber ? { version: versionNumber } : null)
      });

      await this.applicationsWrapper.repository.update({
        namespace: data.owner
      }, {
        topicsCount: () => "topicsCount - 1"
      });
    }
  }
}
