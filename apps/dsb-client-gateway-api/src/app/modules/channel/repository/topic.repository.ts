import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { TopicVersionEntity } from '../channel.interface';
import { TopicVersion } from '../../dsb-client/dsb-client.interface';
import {
  AbstractLokiRepository,
  LokiService,
} from '@dsb-client-gateway/dsb-client-gateway-storage';

@Injectable()
export class TopicRepository
  extends AbstractLokiRepository
  implements OnModuleInit
{
  private readonly logger = new Logger(TopicRepository.name);

  constructor(protected readonly lokiService: LokiService) {
    super('topic', lokiService);
  }

  public onModuleInit(): void {
    this.createCollectionIfNotExists(this.collection);
  }

  public async createOrUpdateTopic(
    data: TopicVersion,
    topicId: string
  ): Promise<void> {
    this.logger.debug('Updating topic', data, topicId);

    const currentTopic: TopicVersionEntity | null = this.getTopic(
      data.name,
      data.owner,
      data.version
    );

    if (currentTopic) {
      const newObject = {
        ...currentTopic,
        ...data,
        topicId,
      };

      this.client
        .getCollection<TopicVersionEntity>(this.collection)
        .update(newObject);

      await this.lokiService.save();

      return;
    }

    this.client.getCollection<TopicVersionEntity>(this.collection).insert({
      ...data,
      topicId,
    });

    await this.lokiService.save();
  }

  public getTopic(
    name: string,
    owner: string,
    version?: string
  ): TopicVersionEntity | null {
    return this.client
      .getCollection<TopicVersionEntity>(this.collection)
      .findOne({
        name,
        owner,
        version,
      });
  }
}
