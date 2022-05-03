import { Injectable } from '@nestjs/common';
import { DidRepository } from '../repository/did.repository';

@Injectable()
export class DidWrapperRepository {
  constructor(public readonly didRepository: DidRepository) {}
}
