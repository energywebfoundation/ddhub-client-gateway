import { Injectable, Logger } from '@nestjs/common';
import {
  TopicEntity,
  TopicRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';

@Injectable()
export class TopicService {
  protected readonly logger = new Logger(TopicService.name);

  constructor(protected readonly wrapper: TopicRepositoryWrapper) {}

  public async createOrUpdateTopic(topicEntity: TopicEntity): Promise<void> {
    await this.wrapper.topicRepository.save(topicEntity);
  }

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
}
