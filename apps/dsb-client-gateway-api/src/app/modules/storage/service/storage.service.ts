import { Injectable, Logger } from '@nestjs/common';
import loki from 'lokijs';
import { Enrolment, Identity } from '../storage.interface';

enum COLLECTIONS {
  IDENTITY = 'identity',
  ENROLMENT = 'enrolment'
}

@Injectable()
export class StorageService {
  protected client: loki;
  private readonly logger = new Logger(StorageService.name);

  constructor() {
    this.client = new loki('data.db', {
      autoload: true,
      autosave: true,
      autosaveInterval: 2000,
    });
  }

  public writeEnrolment(enrolment: Enrolment): void {
    this.createCollectionIfNotExists(COLLECTIONS.ENROLMENT);

    this.removeEnrolment();

    this.client.getCollection(COLLECTIONS.ENROLMENT).insert({
      value: enrolment
    });

    this.logger.log('Stored enrolment');
  }

  public removeEnrolment(): void {
    this.logger.log('Removing enrolment');

    this.createCollectionIfNotExists(COLLECTIONS.ENROLMENT);

    const results = this.client.getCollection(COLLECTIONS.ENROLMENT).find()

    results.forEach((result) => this.client.getCollection(COLLECTIONS.ENROLMENT).remove(result));
  }

  public getEnrolment(): Enrolment | null {
    this.createCollectionIfNotExists(COLLECTIONS.ENROLMENT);

    const results = this.client.getCollection(COLLECTIONS.ENROLMENT).find();

    if(results.length) {
      return results[0].value as any;
    }

    return null;
  }

  public getIdentity(): Identity | null {
    this.createCollectionIfNotExists(COLLECTIONS.IDENTITY);

    const results = this.client.getCollection(COLLECTIONS.IDENTITY).find();

    if(results.length) {
      return results[0].value as any;
    }

    return null;
  }

  public removeIdentity(): void {
    this.logger.log('Removing identity');

    this.createCollectionIfNotExists(COLLECTIONS.IDENTITY);

    const results = this.client.getCollection(COLLECTIONS.IDENTITY).find()

    results.forEach((result) => this.client.getCollection(COLLECTIONS.IDENTITY).remove(result));
  }

  public writeIdentity(identity: Identity): void {
    this.createCollectionIfNotExists(COLLECTIONS.IDENTITY);

    this.removeIdentity();

    this.client.getCollection(COLLECTIONS.IDENTITY).insert({
      value: identity
    });

    this.logger.log('Stored identity');
  }

  private createCollectionIfNotExists(name: COLLECTIONS): void {
    const collection = this.client.getCollection(name);

    if (collection === null) {
      this.client.addCollection(name);
    }
  }
}
