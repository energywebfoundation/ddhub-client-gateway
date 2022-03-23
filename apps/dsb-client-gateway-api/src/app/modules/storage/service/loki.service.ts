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

  public async save(): Promise<void> {
    const promise = () =>
      new Promise((resolve, reject) => {
        this.client.save((err) => {
          if (err) {
            return reject(err);
          }

          return resolve(null);
        });
      });

    await promise();
  }

  public async onModuleInit(): Promise<void> {
    const promise = () =>
      new Promise((resolve, reject) => {
        this.client.loadDatabase({}, (err) => {
          if (err) {
            console.error(err);

            reject(err);
          }

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
