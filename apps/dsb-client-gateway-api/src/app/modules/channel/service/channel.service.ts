import { Injectable, Logger } from '@nestjs/common';
import { ChannelRepository } from '../repository/channel.repository';
import { ChannelEntity, ChannelTopic } from '../entity/channel.entity';
import { CreateChannelDto, TopicDto } from '../dto/request/create-channel.dto';
import { DsbApiService } from '../../dsb-client/service/dsb-api.service';
import { TopicNotFoundException } from '../exceptions/topic-not-found.exception';
import { TopicData } from '../../dsb-client/dsb-client.interface';
import { ChannelNotFoundException } from '../exceptions/channel-not-found.exception';
import moment from 'moment';
import { ChannelUpdateRestrictedFieldsException } from '../exceptions/channel-update-restricted-fields.exception';

@Injectable()
export class ChannelService {
  protected readonly logger = new Logger(ChannelService.name);

  constructor(
    protected readonly channelRepository: ChannelRepository,
    protected readonly dsbApiService: DsbApiService
  ) {}

  public async createChannel(payload: CreateChannelDto): Promise<void> {
    this.logger.log(`Attempting to create channel ${payload.channelName}`);

    this.logger.debug(payload);

    const topicsWithIds: ChannelTopic[] = await this.getTopicsWithIds(
      payload.conditions.topics
    );

    if (topicsWithIds.length === 0) {
      throw new TopicNotFoundException();
    }

    const creationDate: string = moment().toISOString();

    this.channelRepository.createChannel({
      channelName: payload.channelName,
      type: payload.type,
      conditions: {
        topics: topicsWithIds,
        dids: payload.conditions.dids,
        roles: payload.conditions.roles,
      },
      createdAt: creationDate,
      updatedAt: creationDate,
    });

    this.logger.log(`Channel with name ${payload.channelName} created`);
  }

  public getChannelOrThrow(name: string): ChannelEntity {
    const channel: ChannelEntity | null = this.getChannel(name);

    if (!channel) {
      throw new ChannelNotFoundException();
    }

    return channel;
  }

  public getChannel(name: string): ChannelEntity | null {
    return this.channelRepository.getChannel(name);
  }

  public async deleteChannelOrThrow(channelName: string): Promise<void> {
    const channel = this.getChannelOrThrow(channelName);

    this.channelRepository.delete(channel.channelName);
  }

  public async updateChannel(dto: CreateChannelDto): Promise<void> {
    const channel: ChannelEntity = this.getChannelOrThrow(dto.channelName);

    const hasChangedRestrictedFields: boolean =
      channel.type !== dto.type || channel.channelName !== dto.channelName;

    if (hasChangedRestrictedFields) {
      throw new ChannelUpdateRestrictedFieldsException();
    }

    const topicsWithIds: ChannelTopic[] = await this.getTopicsWithIds(
      dto.conditions.topics
    );

    if (topicsWithIds.length === 0) {
      throw new TopicNotFoundException();
    }

    const updateDate: string = moment().toISOString();

    channel.conditions = {
      dids: dto.conditions.dids,
      roles: dto.conditions.roles,
      topics: topicsWithIds,
    };

    channel.updatedAt = updateDate;

    this.channelRepository.updateChannel(channel);
  }

  protected async getTopicsWithIds(
    topics: TopicDto[]
  ): Promise<ChannelTopic[]> {
    const topicsToReturn: ChannelTopic[] = [];

    for (const { topicName, owner } of topics) {
      const receivedTopics = await this.dsbApiService.getTopicsByOwnerAndName(
        topicName,
        owner
      );

      if (receivedTopics.records.length !== 1) {
        this.logger.warn(
          `Topic ${topicName} with owner ${owner} does not exists`
        );

        return [];
      }

      const { id }: TopicData = receivedTopics.records[0];

      topicsToReturn.push({
        topicName,
        owner,
        topicId: id,
      });
    }

    return topicsToReturn;
  }
}
