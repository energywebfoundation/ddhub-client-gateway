import { Injectable, Logger } from '@nestjs/common';
import loki from 'lokijs';
import { Identity } from '../storage.interface';

enum COLLECTIONS {
  IDENTITY = 'identity'
}

@Injectable()
export class LokiService {
  protected client: loki;
  private readonly logger = new Logger(LokiService.name);

  constructor() {

    this.client = new loki('data.db', {
      autoload: true,
      autosave: true,
      autosaveInterval: 4000,
    });
  }

  public writeIdentity(identity: Identity): void {
    this.createCollectionIfNotExists(COLLECTIONS.IDENTITY);

    this.client.getCollection(COLLECTIONS.IDENTITY).insert(identity);

    this.logger.log({
      message: 'Stored identity',
    });
  }

  private createCollectionIfNotExists(name: COLLECTIONS): void {
    const collection = this.client.getCollection(name);

    if (collection === null) {
      this.client.addCollection(name);
    }
  }
}
