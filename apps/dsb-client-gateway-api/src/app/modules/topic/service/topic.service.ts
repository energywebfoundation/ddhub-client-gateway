import { Injectable, Logger } from '@nestjs/common';
import {
  TopicEntity,
  TopicRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { Span } from 'nestjs-otel';
import { GetTopicResponse } from '../entity/topic.entity';

@Injectable()
export class TopicService {
  protected readonly logger = new Logger(TopicService.name);

  constructor(protected readonly wrapper: TopicRepositoryWrapper) {}

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
}
