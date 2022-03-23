import { AbstractLokiRepository } from '../../storage/repository/abstract-loki.repository';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { LokiService } from '../../storage/service/loki.service';
import { TopicVersion } from '../../dsb-client/dsb-client.interface';

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

  public async createOrUpdateTopic(data: TopicVersion): Promise<void> {
    const currentTopic: TopicVersion | null = this.getTopic(
      data.name,
      data.owner,
      data.version
    );

    if (currentTopic) {
      const newObject = {
        ...currentTopic,
        ...data,
      };

      this.client
        .getCollection<TopicVersion>(this.collection)
        .update(newObject);

      await this.client.save();

      return;
    }

    this.client.getCollection<TopicVersion>(this.collection).insert(data);

    await this.lokiService.save();
  }

  public getTopic(
    name: string,
    owner: string,
    version: string
  ): TopicVersion | null {
    return this.client.getCollection<TopicVersion>(this.collection).findOne({
      name,
      owner,
      version,
    });
  }
}
