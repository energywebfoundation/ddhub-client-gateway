import { Injectable, Logger } from '@nestjs/common';
import {
  TopicEntity,
  TopicRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { Span } from 'nestjs-otel';
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
  ): Promise<TopicEntity[]> {
    try {
      const result: TopicEntity[] = [];
      const topics = await this.wrapper.topicRepository.getTopics(
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
        result.push(topicsGroupByVersion[topicName][length - 1]);
      }

      this.logger.log(`get topics with owner:${owner} successful`);
      return result;
    } catch (e) {
      this.logger.error(`get topics with owner:${owner} failed`, e);
      throw e;
    }
  }
}
