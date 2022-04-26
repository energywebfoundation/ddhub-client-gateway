import { Injectable } from '@nestjs/common';
import { TopicRepository } from '../repository';

@Injectable()
export class TopicRepositoryWrapper {
  constructor(public readonly topicRepository: TopicRepository) {}
}
