import { Injectable } from '@nestjs/common';
import { LokiService } from '../service/loki.service';
import loki from 'lokijs';

@Injectable()
export abstract class AbstractLokiRepository<T extends object = any> {
  public readonly client: loki;

  protected constructor(
    protected readonly collection: string,
    protected readonly lokiService: LokiService
  ) {
    this.client = lokiService.client;
  }

  protected createCollectionIfNotExists(
    name: string,
    indices: string[] = []
  ): void {
    const collection = this.client.getCollection(name);

    if (collection === null) {
      this.client.addCollection(name, {
        indices,
      });
    }
  }

  protected getCollection(): loki.Collection<T> {
    return this.client.getCollection<T>(this.collection);
  }
}
