import { Injectable } from '@nestjs/common';
import { ApplicationRepository } from '../repository/application.repository';

@Injectable()
export class ApplicationWrapperRepository {
  constructor(public readonly repository: ApplicationRepository) {}
}
