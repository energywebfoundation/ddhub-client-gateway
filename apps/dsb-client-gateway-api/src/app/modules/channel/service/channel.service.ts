import { Injectable, Logger } from '@nestjs/common';
import { ChannelRepository } from '../repository/channel.repository';
import { ChannelEntity, ChannelTopic } from '../entity/channel.entity';
import { CreateChannelDto, TopicDto } from '../dto/request/create-channel.dto';
import { DsbApiService } from '../../dsb-client/service/dsb-api.service';
import { Topic } from '../../dsb-client/dsb-client.interface';
import { ChannelNotFoundException } from '../exceptions/channel-not-found.exception';
import moment from 'moment';
import { ChannelUpdateRestrictedFieldsException } from '../exceptions/channel-update-restricted-fields.exception';
import { CommandBus } from '@nestjs/cqrs';
import { ChannelQualifiedDids, TopicEntity } from '../channel.interface';
import { ChannelType } from '../channel.const';
import { UpdateChannelDto } from '../dto/request/update-channel.dto';
import { RefreshChannelCacheDataCommand } from '../command/refresh-channel-cache-data.command';
import { ChannelAlreadyExistsException } from '../exceptions/channel-already-exists.exception';

@Injectable()
export class ChannelService {
  protected readonly logger = new Logger(ChannelService.name);

  constructor(
    protected readonly channelRepository: ChannelRepository,
    protected readonly dsbApiService: DsbApiService,
    protected readonly commandBus: CommandBus
  ) {}

  public getChannels(): ChannelEntity[] {
    return this.channelRepository.getAll();
  }

  public async createChannel(payload: CreateChannelDto): Promise<void> {
    this.logger.log(`Attempting to create channel ${payload.fqcn}`);

    const channel = this.getChannel(payload.fqcn);

    if (channel) {
      throw new ChannelAlreadyExistsException();
    }

    this.logger.debug(payload);

    const topicsWithIds: ChannelTopic[] = await this.getTopicsWithIds(
      payload.conditions.topics
    );

    const creationDate: string = moment().toISOString();

    await this.channelRepository.createChannel({
      fqcn: payload.fqcn,
      type: payload.type,
      conditions: {
        topics: topicsWithIds,
        dids: payload.conditions.dids,
        roles: payload.conditions.roles,
        qualifiedDids: [],
        topicsVersions: {},
      },
      createdAt: creationDate,
      updatedAt: creationDate,
    });

    this.logger.log(`Channel with name ${payload.fqcn} created`);

    await this.commandBus.execute(
      new RefreshChannelCacheDataCommand(payload.fqcn)
    );
  }

  public async updateChannelTopic(
    channelName: string,
    topicId: string,
    topicVersions: TopicEntity[]
  ): Promise<void> {
    const channel: ChannelEntity = this.getChannel(channelName);

    channel.conditions.topicsVersions = {
      ...channel.conditions.topicsVersions,
      [topicId]: topicVersions,
    };

    await this.channelRepository.updateChannel(channel);
  }

  public async updateChannelQualifiedDids(
    channelName: string,
    dids: string[]
  ): Promise<void> {
    const channel: ChannelEntity = this.getChannel(channelName);

    channel.conditions.qualifiedDids = dids;

    await this.channelRepository.updateChannel(channel);
  }

  public getChannelQualifiedDids(fqcn: string): ChannelQualifiedDids {
    const channel: ChannelEntity = this.getChannelOrThrow(fqcn);

    const uniqueDids: string[] = [
      ...new Set([
        ...channel.conditions.dids,
        ...channel.conditions.qualifiedDids,
      ]),
    ];

    return {
      qualifiedDids: uniqueDids,
      fqcn: channel.fqcn,
      updatedAt: channel.updatedAt,
    };
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

    await this.channelRepository.delete(channel.fqcn);
  }

  public async updateChannel(
    dto: UpdateChannelDto,
    fqcn: string
  ): Promise<void> {
    const channel: ChannelEntity = this.getChannelOrThrow(fqcn);

    const hasChangedRestrictedFields: boolean =
      channel.type !== dto.type || channel.fqcn !== fqcn;

    if (hasChangedRestrictedFields) {
      throw new ChannelUpdateRestrictedFieldsException();
    }

    const topicsWithIds: ChannelTopic[] = await this.getTopicsWithIds(
      dto.conditions.topics
    );

    const updateDate: string = moment().toISOString();

    channel.conditions = {
      ...channel.conditions,
      dids: dto.conditions.dids,
      roles: dto.conditions.roles,
      topics: topicsWithIds,
    };

    channel.updatedAt = updateDate;

    await this.channelRepository.updateChannel(channel);

    await this.commandBus.execute(new RefreshChannelCacheDataCommand(fqcn));
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

      const { id }: Topic = receivedTopics.records[0];

      topicsToReturn.push({
        topicName,
        owner,
        topicId: id,
      });
    }

    return topicsToReturn;
  }

  public getChannelsByType(type?: ChannelType): ChannelEntity[] {
    return this.channelRepository.getChannelsByType(type);
  }
}
