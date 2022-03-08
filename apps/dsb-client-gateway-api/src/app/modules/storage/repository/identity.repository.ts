import { Injectable, Logger } from '@nestjs/common';
import { AbstractLokiRepository } from './abstract-loki.repository';
import { Identity } from '../storage.interface';

@Injectable()
export class IdentityRepository extends AbstractLokiRepository {
  private readonly logger = new Logger(IdentityRepository.name);

  constructor() {
    super('identity');
  }

  public getIdentity(): Identity | null {
    this.createCollectionIfNotExists(this.collection);

    const results = this.client.getCollection(this.collection).find();

    if (results.length) {
      return results[0].value as any;
    }

    return null;
  }

  public removeIdentity(): void {
    this.logger.log('Removing identity');

    this.createCollectionIfNotExists(this.collection);

    const results = this.client.getCollection(this.collection).find();

    results.forEach((result) =>
      this.client.getCollection(this.collection).remove(result)
    );
  }

  public writeIdentity(identity: Identity): void {
    this.createCollectionIfNotExists(this.collection);

    this.removeIdentity();

    this.client.getCollection(this.collection).insert({
      value: identity,
    });

    this.logger.log('Stored identity');
  }
}
