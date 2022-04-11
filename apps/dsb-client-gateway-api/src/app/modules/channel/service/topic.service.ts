import { Injectable, Logger } from '@nestjs/common';
import { TopicRepository } from '../repository/topic.repository';
import { TopicEntity } from '../channel.interface';

@Injectable()
export class TopicService {
  protected readonly logger = new Logger(TopicService.name);

  constructor(protected readonly topicRepository: TopicRepository) {}

  public getTopic(
    name: string,
    owner: string,
    version?: string
  ): TopicEntity | null {
    return this.topicRepository.getTopic(name, owner, version);
  }
}
