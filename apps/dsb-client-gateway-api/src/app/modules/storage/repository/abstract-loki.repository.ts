import { Injectable } from '@nestjs/common';
import loki from 'lokijs';

@Injectable()
export abstract class AbstractLokiRepository {
  protected readonly client: loki;

  protected constructor(protected readonly collection: string) {
    this.client = new loki('data.db', {
      autoload: true,
      autosave: true,
      autosaveInterval: 2000,
    });
  }

  protected createCollectionIfNotExists(name: string): void {
    const collection = this.client.getCollection(name);

    if (collection === null) {
      this.client.addCollection(name);
    }
  }
}
