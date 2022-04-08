import { Injectable, Logger } from '@nestjs/common';
import { TopicRepository } from '../repository/topic.repository';
import { TopicVersion } from '../../dsb-client/dsb-client.interface';

@Injectable()
export class TopicService {
  protected readonly logger = new Logger(TopicService.name);

  constructor(protected readonly topicRepository: TopicRepository) {}

  public getTopic(
    name: string,
    owner: string,
    version?: string
  ): TopicVersion | null {
    return this.topicRepository.getTopic(name, owner, version);
  }
}
