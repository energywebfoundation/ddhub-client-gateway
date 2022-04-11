import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { TopicEntity } from '../channel.interface';
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
    data: TopicEntity,
    topicId: string
  ): Promise<void> {
    this.logger.debug('Updating topic', data, topicId);

    const currentTopic: TopicEntity | null = this.getTopic(
      data.name,
      data.owner,
      data.version
    );

    if (currentTopic) {
      const newObject: TopicEntity = {
        ...currentTopic,
        ...data,
        id: topicId,
      };

      this.client.getCollection<TopicEntity>(this.collection).update(newObject);

      await this.lokiService.save();

      return;
    }

    this.client.getCollection<TopicEntity>(this.collection).insert({
      ...data,
      id: topicId,
    });

    await this.lokiService.save();
  }

  public getTopic(
    name: string,
    owner: string,
    version?: string
  ): TopicEntity | null {
    if (!version) {
      return this.client.getCollection<TopicEntity>(this.collection).findOne({
        name,
        owner,
      });
    }

    return this.client.getCollection<TopicEntity>(this.collection).findOne({
      name,
      owner,
      version,
    });
  }
}
