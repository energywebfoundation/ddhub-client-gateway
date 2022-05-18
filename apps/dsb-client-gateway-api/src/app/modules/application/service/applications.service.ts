import { Injectable, Logger } from '@nestjs/common';
import {
  ApplicationEntity,
  ApplicationWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);
  constructor(
    protected readonly applicationsWrapper: ApplicationWrapperRepository
  ) {}

  public async getApplications(roleName): Promise<ApplicationEntity[]> {
    return this.applicationsWrapper.repository.find({});
  }
}
