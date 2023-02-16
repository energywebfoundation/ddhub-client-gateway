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
    await this.refreshTopics();
  }

  @Span('topic_refresh')
  public async refreshTopics(): Promise<void> {
    try {
      const isInitialized: boolean = this.iamService.isInitialized();

      if (!isInitialized) {
        this.logger.error(`IAM is not initialized. Please setup private key`);

        return;
      }

      this.logger.log('fetching all available applications');

      const topics: TopicEntity[] = await this.wrapper.topicRepository.find({});

      for (const topic of topics) {
        const topicFromMb = await this.ddhubTopicsService.getTopicById(
          topic.id
        );

        if (!topicFromMb) {
          await this.wrapper.topicRepository.delete({
            id: topic.id,
          });

          this.logger.log(`removed topic ${topic.id}`);
        }
      }
    } catch (e) {
      this.logger.error(e);
    }
  }
}
