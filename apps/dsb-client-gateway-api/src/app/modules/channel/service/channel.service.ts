import { Injectable, Logger } from '@nestjs/common';
import { ChannelTopic } from '../entity/channel.entity';
import { CreateChannelDto, TopicDto } from '../dto/request/create-channel.dto';
import { ChannelNotFoundException } from '../exceptions/channel-not-found.exception';
import { ChannelUpdateRestrictedFieldsException } from '../exceptions/channel-update-restricted-fields.exception';
import { CommandBus } from '@nestjs/cqrs';
import { ChannelQualifiedDids } from '../channel.interface';
import { ChannelType } from '../channel.const';
import { UpdateChannelDto } from '../dto/request/update-channel.dto';
import { RefreshChannelCacheDataCommand } from '../command/refresh-channel-cache-data.command';
import { ChannelAlreadyExistsException } from '../exceptions/channel-already-exists.exception';
import { Span } from 'nestjs-otel';
import {
  ChannelEntity,
  ChannelWrapperRepository,
  TopicEntity,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { TopicNotFoundException } from '../exceptions/topic-not-found.exception';
import {
  DdhubTopicsService,
  SchemaType,
  Topic,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { ChannelInvalidTopicException } from '../exceptions/channel-invalid-topic.exception';
import { TopicService } from '../../topic/service/topic.service';

@Injectable()
export class ChannelService {
  protected readonly logger = new Logger(ChannelService.name);

  constructor(
    protected readonly wrapperRepository: ChannelWrapperRepository,
    protected readonly ddhubTopicsService: DdhubTopicsService,
    protected readonly topicsService: TopicService,
    protected readonly commandBus: CommandBus
  ) { }

  @Span('channels_getChannels')
  public async getChannels(): Promise<ChannelEntity[]> {
    return this.wrapperRepository.channelRepository.getAll();
  }

  @Span('channels_createChannel')
  public async createChannel(payload: CreateChannelDto): Promise<void> {
    this.logger.log(`Attempting to create channel ${payload.fqcn}`);

    const channel: ChannelEntity = await this.getChannel(payload.fqcn);

    if (channel) {
      throw new ChannelAlreadyExistsException(payload.fqcn);
    }

    this.logger.debug(payload);

    const topicsWithIds: ChannelTopic[] = await this.getTopicsWithIds(
      payload.conditions.topics
    );

    await this.validateTopics(topicsWithIds, payload.type);

    if (payload.conditions.topics.length && !topicsWithIds.length) {
      throw new TopicNotFoundException();
    }

    await this.wrapperRepository.channelRepository.save({
      fqcn: payload.fqcn,
      type: payload.type,
      payloadEncryption: payload.payloadEncryption,
      conditions: {
        topics: topicsWithIds,
        dids: payload.conditions.dids,
        roles: payload.conditions.roles,
        qualifiedDids: [],
      },
    });

    this.logger.log(`Channel with name ${payload.fqcn} created`);

    await this.commandBus.execute(
      new RefreshChannelCacheDataCommand(payload.fqcn)
    );
  }

  @Span('channels_updateQualifiedDids')
  public async updateChannelQualifiedDids(
    fqcn: string,
    dids: string[]
  ): Promise<void> {
    const channel: ChannelEntity = await this.getChannel(fqcn);

    channel.conditions.qualifiedDids = dids;

    await this.wrapperRepository.channelRepository.update(fqcn, channel);
  }

  @Span('channels_getChannelQualifiedDids')
  public async getChannelQualifiedDids(
    fqcn: string
  ): Promise<ChannelQualifiedDids> {
    const channel: ChannelEntity = await this.getChannelOrThrow(fqcn);

    const uniqueDids: string[] = [
      ...new Set([
        ...channel.conditions.dids,
        ...channel.conditions.qualifiedDids,
      ]),
    ];

    return {
      qualifiedDids: uniqueDids,
      fqcn: channel.fqcn,
      updatedAt: channel.updatedDate.toISOString(),
    };
  }

  public async getChannelOrThrow(fqcn: string): Promise<ChannelEntity> {
    const channel: ChannelEntity =
      await this.wrapperRepository.channelRepository.findOne({
        where: {
          fqcn,
        },
      });

    if (!channel) {
      throw new ChannelNotFoundException(fqcn);
    }

    return channel;
  }

  public async getChannel(fqcn: string): Promise<ChannelEntity | null> {
    return this.wrapperRepository.channelRepository.findOne({
      where: {
        fqcn,
      },
    });
  }

  public async deleteChannelOrThrow(fqcn: string): Promise<void> {
    const channel = await this.getChannelOrThrow(fqcn);

    await this.wrapperRepository.channelRepository.delete({
      fqcn: channel.fqcn,
    });
  }

  @Span('channels_updateChannel')
  public async updateChannel(
    dto: UpdateChannelDto,
    fqcn: string
  ): Promise<void> {
    const channel: ChannelEntity = await this.getChannelOrThrow(fqcn);

    const hasChangedRestrictedFields: boolean =
      channel.type !== dto.type || channel.fqcn !== fqcn;

    if (hasChangedRestrictedFields) {
      throw new ChannelUpdateRestrictedFieldsException();
    }

    const topicsWithIds: ChannelTopic[] = await this.getTopicsWithIds(
      dto.conditions.topics
    );

    await this.validateTopics(topicsWithIds, channel.type);

    channel.payloadEncryption =
      dto.payloadEncryption ?? channel.payloadEncryption;

    channel.conditions = {
      ...channel.conditions,
      dids: dto.conditions.dids,
      roles: dto.conditions.roles,
      topics: topicsWithIds,
    };

    await this.wrapperRepository.channelRepository.save(channel);

    await this.commandBus.execute(new RefreshChannelCacheDataCommand(fqcn));
  }

  @Span('channels_validateTopic')
  protected async validateTopics(
    topics: ChannelTopic[],
    channelType: ChannelType
  ): Promise<void> {
    const textSchemaTypes: SchemaType[] = [SchemaType.JSD7, SchemaType.XML];
    for (const topic of topics) {
      if ([ChannelType.PUB, ChannelType.SUB].includes(channelType)) {
        if (!textSchemaTypes.includes(topic.schemaType as SchemaType)) {
          throw new ChannelInvalidTopicException(topic.topicId);
        }
      } else {
        if (textSchemaTypes.includes(topic.schemaType as SchemaType)) {
          throw new ChannelInvalidTopicException(topic.topicId);
        }
      }
    }
  }

  @Span('channels_getTopicsWithIds')
  protected async getTopicsWithIds(
    topics: TopicDto[]
  ): Promise<ChannelTopic[]> {
    const topicsToReturn: ChannelTopic[] = [];

    for (const { topicName, owner } of topics) {
      const receivedTopics = await this.ddhubTopicsService
        .getTopicsByOwnerAndName(topicName, owner)
        .catch((e) => {
          if (e?.response?.status !== 404) {
            throw e;
          }

          return {
            records: [],
          };
        });

      if (receivedTopics.records.length !== 1) {
        this.logger.warn(
          `Topic ${topicName} with owner ${owner} does not exists`
        );

        return [];
      }

      const { id, schemaType }: Topic = receivedTopics.records[0];

      topicsToReturn.push({
        topicName,
        owner,
        topicId: id,
        schemaType: schemaType,
      });
    }

    return topicsToReturn;
  }

  @Span('channels_getChannelsByType')
  public async getChannelsByType(type?: ChannelType): Promise<ChannelEntity[]> {
    return this.wrapperRepository.channelRepository.getChannelsByType(type);
  }
}
