import {
  ApplicationDTO,
  IamService,
} from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { Injectable, Logger } from '@nestjs/common';
import { DdhubTopicsService } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';

@Injectable()
export class TopicService {
  private readonly logger = new Logger(TopicService.name);
  constructor(
    protected readonly iamService: IamService,
    protected readonly ddhubTopicService: DdhubTopicsService
  ) {}

  public async getApplications(roleName) {
    this.logger.debug('start: Topic Service getApplications ');

    let finalApllicationsResult: Array<ApplicationDTO> = [];
    const applications: Array<ApplicationDTO> =
      await this.iamService.getApplicationsByOwnerAndRole(
        roleName,
        this.iamService.getDIDAddress()
      );

    this.logger.debug('applications fetched successfully.', applications);

    if (applications && applications.length > 0) {
      const nameSpaces: string[] = applications.map(
        (application) => application.namespace
      );

      this.logger.debug('fetching topic count for applications.');
      const topicsCount = await this.ddhubTopicService.getTopicsCountByOwner(
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
