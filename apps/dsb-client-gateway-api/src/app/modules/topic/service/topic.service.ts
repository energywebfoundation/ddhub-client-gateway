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

  constructor(protected readonly wrapper: TopicRepositoryWrapper) { }

  @Span('topics_getTopics')
  public async getTopics(
    limit: number,
    name: string,
    owner: string,
    page: number,
    tags: string[]
  ): Promise<GetTopicResponse | []> {
    try {
      const latestTopicsFromCache: TopicEntity[] = [];

      const result: GetTopicResponse = {
        records: [],
        count: 0,
        limit: 1,
        page: 1,
      };

      const [topics, total] =
        await this.wrapper.topicRepository.getTopicsAndCount(
          limit,
          name,
          owner,
          page,
          tags
        );

      if (topics.length === 0) {
        return [];
      }
      const topicsGroupByVersion = topics.reduce(function (result, topic) {
        result[topic.name] = result[topic.name] || [];
        result[topic.name].push(topic);
        return result;
      }, Object.create(null));

      for (const topicName in topicsGroupByVersion) {
        const length = topicsGroupByVersion[topicName].length;
        latestTopicsFromCache.push(topicsGroupByVersion[topicName][length - 1]);
      }

      result.records = latestTopicsFromCache;
      result.count = total;
      result.limit = limit ? limit : 1;
      result.page = page ? page : 1;

      this.logger.log(`get topics with owner:${owner} successful`);
      return result;
    } catch (e) {
      this.logger.error(`get topics with owner:${owner} failed`, e);
      throw e;
    }
  }
}
