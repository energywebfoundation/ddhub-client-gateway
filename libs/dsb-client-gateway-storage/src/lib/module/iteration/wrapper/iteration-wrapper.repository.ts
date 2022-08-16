import { Injectable } from '@nestjs/common';
import { IterationRepository } from '../repository';

@Injectable()
export class IterationWrapperRepository {
  constructor(public readonly keyRepository: IterationRepository) {}
}
