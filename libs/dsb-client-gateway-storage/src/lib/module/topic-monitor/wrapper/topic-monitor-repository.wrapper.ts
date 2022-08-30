import { Injectable } from '@nestjs/common';
import { TopicMonitorRepository } from '../repository';

@Injectable()
export class TopicMonitorRepositoryWrapper {
  constructor(public readonly topicRepository: TopicMonitorRepository) {}
}
