import { Injectable } from '@nestjs/common';
import { SymmetricKeysRepository } from '../repository';

@Injectable()
export class SymmetricKeysRepositoryWrapper {
  constructor(
    public readonly symmetricKeysRepository: SymmetricKeysRepository
  ) {}
}
