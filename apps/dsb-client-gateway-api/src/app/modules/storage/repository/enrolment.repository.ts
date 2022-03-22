import { Injectable, Logger } from '@nestjs/common';
import { AbstractLokiRepository } from './abstract-loki.repository';
import { Enrolment } from '../storage.interface';
import { LokiService } from '../service/loki.service';

@Injectable()
export class EnrolmentRepository extends AbstractLokiRepository {
  private readonly logger = new Logger(EnrolmentRepository.name);

  constructor(protected readonly lokiService: LokiService) {
    super('enrolment', lokiService);
  }

  public writeEnrolment(enrolment: Enrolment): void {
    this.createCollectionIfNotExists(this.collection);

    this.removeEnrolment();

    this.client.getCollection(this.collection).insert({
      value: enrolment,
    });

    this.logger.log('Stored enrolment');
  }

  public removeEnrolment(): void {
    this.logger.log('Removing enrolment');

    this.createCollectionIfNotExists(this.collection);

    const results = this.client.getCollection(this.collection).find();

    results.forEach((result) =>
      this.client.getCollection(this.collection).remove(result)
    );
  }

  public getEnrolment(): Enrolment | null {
    this.createCollectionIfNotExists(this.collection);

    const results = this.client.getCollection(this.collection).find();

    if (results.length) {
      return results[0].value as Enrolment;
    }

    return null;
  }
}
