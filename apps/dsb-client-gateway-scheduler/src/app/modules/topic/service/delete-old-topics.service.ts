import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import {
  TopicEntity,
  TopicRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { DdhubTopicsService } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { Span } from 'nestjs-otel';

@Injectable()
export class DeleteOldTopicsService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(DeleteOldTopicsService.name);

  constructor(
    protected readonly wrapper: TopicRepositoryWrapper,
    protected readonly iamService: IamService,
    protected readonly ddhubTopicsService: DdhubTopicsService
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    await this.deleteMissingTopics();
  }

  @Span('topic_delete_missing_topics')
  public async deleteMissingTopics(): Promise<void> {
    try {
      const isInitialized: boolean = this.iamService.isInitialized();

      if (!isInitialized) {
        this.logger.error(`IAM is not initialized. Please setup private key`);

        return;
      }

      this.logger.log('fetching all available applications');

      const topics: TopicEntity[] = await this.wrapper.topicRepository.find({});

      for (const topic of topics) {
        try {
          await this.ddhubTopicsService.getTopicVersionsById(topic.id);
        } catch (e) {
          if (e.additionalDetails.errorCode === '50') {
            await this.wrapper.topicRepository.delete({
              id: topic.id,
            });

            this.logger.log(`removed topic ${topic.id}`);
          }
        }
      }
    } catch (e) {
      this.logger.error(e);
    }
  }
}
