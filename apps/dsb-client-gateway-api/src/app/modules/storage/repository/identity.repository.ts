import { Injectable, Logger } from '@nestjs/common';
import { Identity } from '@dsb-client-gateway/dsb-client-gateway/identity/models';
import {
  AbstractLokiRepository,
  LokiService,
} from '@dsb-client-gateway/dsb-client-gateway-storage';

@Injectable()
export class IdentityRepository extends AbstractLokiRepository {
  private readonly logger = new Logger(IdentityRepository.name);

  constructor(protected readonly lokiService: LokiService) {
    super('identity', lokiService);
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

  public async writeIdentity(identity: Identity): Promise<void> {
    this.createCollectionIfNotExists(this.collection);

    this.removeIdentity();

    this.client.getCollection(this.collection).insert({
      value: identity,
    });

    await this.lokiService.save();

    this.logger.log('Stored identity');
  }
}
