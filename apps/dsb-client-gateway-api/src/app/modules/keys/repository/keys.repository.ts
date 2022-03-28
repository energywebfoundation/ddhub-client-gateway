import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AbstractLokiRepository } from '../../storage/repository/abstract-loki.repository';
import { LokiService } from '../../storage/service/loki.service';
import { TopicRepository } from '../../channel/repository/topic.repository';
import { KeysEntity } from '../keys.interface';

@Injectable()
export class KeysRepository
  extends AbstractLokiRepository
  implements OnModuleInit
{
  private readonly logger = new Logger(TopicRepository.name);

  constructor(protected readonly lokiService: LokiService) {
    super('keys', lokiService);
  }

  public onModuleInit(): void {
    this.createCollectionIfNotExists(this.collection);
  }

  public async storeKeys(entity: KeysEntity): Promise<void> {
    this.client.getCollection<KeysEntity>(this.collection).insert(entity);

    await this.client.save();

    this.logger.debug(`Added key entity`, entity);
  }
}
