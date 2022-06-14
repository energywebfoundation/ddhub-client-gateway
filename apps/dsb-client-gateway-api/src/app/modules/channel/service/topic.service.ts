import { Injectable, Logger } from '@nestjs/common';
import {
  TopicEntity,
  TopicRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';

@Injectable()
export class TopicService {
  protected readonly logger = new Logger(TopicService.name);

  constructor(protected readonly wrapper: TopicRepositoryWrapper) {}

  public async getTopic(
    name: string,
    owner: string,
    version?: string
  ): Promise<TopicEntity | null> {
    if (!version) {
      return this.wrapper.topicRepository.findOne({
        where: {
          name,
          owner,
        },
      });
    }

    return this.wrapper.topicRepository.findOne({
      where: {
        name,
        owner,
        version,
      },
    });
  }

  public async getTopicById(id: string): Promise<TopicEntity | null> {
    return this.wrapper.topicRepository.findOne({
      where: {
        id,
      },
    });
  }

  async getTopicOrThrow(name: string, owner: string, version: string) {
    return this.wrapper.topicRepository.findOneOrFail({
      where: {
        name,
        owner,
        version,
      },
    });
  }
}
