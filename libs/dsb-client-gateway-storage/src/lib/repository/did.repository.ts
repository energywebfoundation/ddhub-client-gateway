import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { DidEntity } from '../entity/did.entity';
import { LokiService } from '../service/loki.service';
import { AbstractLokiRepository } from './abstract-loki.repository';

@Injectable()
export class DidRepository
  extends AbstractLokiRepository<DidEntity>
  implements OnModuleInit
{
  private readonly logger = new Logger(DidRepository.name);

  constructor(protected readonly lokiService: LokiService) {
    super('channel', lokiService);
  }

  public onModuleInit(): void {
    this.createCollectionIfNotExists(this.collection);
  }

  public async upsertDid(
    did: string,
    publicRSAKey?: string,
    publicSignatureKey?: string
  ): Promise<void> {
    const entity: DidEntity | null = this.getCollection().findOne({
      id: did,
    });

    if (!entity) {
      this.logger.log(`Storing DID ${did} in cache`);

      this.getCollection().insert({
        id: did,
        publicRSAKey,
        publicSignatureKey,
      });

      await this.lokiService.save();

      return;
    }

    this.logger.log(`Updating DID ${did}`);

    this.getCollection().updateWhere(
      ({ id }) => id === did,
      (obj) => obj
    );

    await this.lokiService.save();
  }
}
