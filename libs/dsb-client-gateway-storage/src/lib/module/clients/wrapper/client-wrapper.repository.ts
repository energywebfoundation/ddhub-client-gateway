import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../repository/client.repository';

@Injectable()
export class ClientWrapperRepository {
  constructor(public readonly repository: ClientRepository) {}
}
