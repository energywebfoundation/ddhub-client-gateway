import { Injectable } from '@nestjs/common';
import { KeyRepository } from '../repository';

@Injectable()
export class KeyWrapperRepository {
  constructor(public readonly keyRepository: KeyRepository) {}
}
