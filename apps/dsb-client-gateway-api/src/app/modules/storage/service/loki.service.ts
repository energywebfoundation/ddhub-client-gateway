import { Injectable, OnModuleInit } from '@nestjs/common';
import loki from 'lokijs';

@Injectable()
export class LokiService implements OnModuleInit {
  public readonly client: loki;

  constructor() {
    this.client = new loki('data.db', {
      autoload: true,
      autosave: true,
      autosaveInterval: 2000,
    });
  }

  public async onModuleInit(): Promise<void> {
    const promise = () =>
      new Promise((resolve, reject) => {
        this.client.loadDatabase({}, () => {
          resolve(null);
        });
      });

    await promise();
  }

  public createCollectionIfNotExists(name: string): void {
    const collection = this.client.getCollection(name);

    if (collection === null) {
      this.client.addCollection(name);
    }
  }
}
