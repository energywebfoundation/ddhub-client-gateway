import { Injectable } from '@nestjs/common';
import {
  ApplicationEntity,
  ApplicationWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';

@Injectable()
export class ApplicationsService {
  constructor(
    protected readonly applicationsWrapper: ApplicationWrapperRepository
  ) {}

  public async getApplications(roleName: string): Promise<ApplicationEntity[]> {
    return this.applicationsWrapper.repository
      .find()
      .then((applications: ApplicationEntity[]) =>
        applications.filter(({ roles }) => roles.includes(roleName))
      );
  }
}
