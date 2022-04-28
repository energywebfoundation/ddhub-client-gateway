import { Injectable } from '@nestjs/common';
import { IdentityRepository } from '../repository';

@Injectable()
export class IdentityRepositoryWrapper {
  constructor(public readonly identityRepository: IdentityRepository) {}
}
