import { Injectable } from '@nestjs/common';
import { AssociationKeysRepository } from '../repository/association-keys.repository';

@Injectable()
export class AssociationKeysWrapperRepository {
  constructor(public readonly repository: AssociationKeysRepository) {}
}
