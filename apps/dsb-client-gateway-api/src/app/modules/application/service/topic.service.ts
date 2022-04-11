import { ApplicationDTO } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { Injectable, Logger } from '@nestjs/common';
import { DsbApiService } from '../../dsb-client/service/dsb-api.service';

@Injectable()
export class TopicService {
  private readonly logger = new Logger(TopicService.name);
  constructor(protected readonly dsbClientService: DsbApiService) {}

  public async getApplications(roleName) {
    this.logger.debug('start: Topic Service getApplications ');

    let finalApllicationsResult: Array<ApplicationDTO> = [];
    const applications: Array<ApplicationDTO> =
      await this.dsbClientService.getApplicationsByOwnerAndRole(roleName);

    this.logger.debug('applications fetched successfully.', applications);

    if (applications && applications.length > 0) {
      const nameSpaces: string[] = applications.map(
        (application) => application.namespace
      );

      this.logger.debug('fetching topic count for applications.');
      const topicsCount = await this.dsbClientService.getTopicsCountByOwner(
        nameSpaces
      );

      this.logger.debug('constructing final applications structure.');
      finalApllicationsResult = applications.map((application) => {
        application.topicsCount = topicsCount[application.namespace]
          ? topicsCount[application.namespace]
          : 0;
        return application;
      });
    }
    return finalApllicationsResult;
  }
}
