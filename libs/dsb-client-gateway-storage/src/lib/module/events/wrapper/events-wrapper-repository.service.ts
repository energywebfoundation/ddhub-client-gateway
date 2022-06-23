import { Injectable } from '@nestjs/common';
import { EventsRepository } from '../repository/events.repository';

@Injectable()
export class EventsWrapperRepository {
  constructor(public readonly repository: EventsRepository) {}
}
