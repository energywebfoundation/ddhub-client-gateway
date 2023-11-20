import { Injectable, Logger } from '@nestjs/common';
import { ChannelTopic } from '../entity/channel.entity';
import {
  CreateChannelDto,
  ResponseTopicDto,
  TopicDto,
} from '../dto/request/create-channel.dto';
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
  ChannelResponseTopic,
  ChannelWrapperRepository,
  QueryChannels,
  ReceivedMessageRepositoryWrapper,
  SentMessageRepositoryWrapper,
  TopicRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { TopicNotFoundException } from '../exceptions/topic-not-found.exception';
import {
  DdhubTopicsService,
  SchemaType,
  Topic,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { ChannelInvalidTopicException } from '../exceptions/channel-invalid-topic.exception';
import { differenceBy } from 'lodash';
import { ChannelMessageFormsOnlyException } from '../exceptions/channel-message-forms-only.exception';
import { GetChannelMessagesCountDto } from '../dto/request/get-channel-messages-count.dto';
import { In } from 'typeorm';

@Injectable()
export class ChannelService {
  protected readonly logger = new Logger(ChannelService.name);

  constructor(
    protected readonly wrapperRepository: ChannelWrapperRepository,
    protected readonly ddhubTopicsService: DdhubTopicsService,
    protected readonly commandBus: CommandBus,
    protected readonly sentMessagesRepositoryWrapper: SentMessageRepositoryWrapper,
    protected readonly receivedMessagesRepositoryWrapper: ReceivedMessageRepositoryWrapper,
    protected readonly topicRepository: TopicRepositoryWrapper
  ) {}

  @Span('channels_multipleMessageCount')
  public async getMultipleChannelsMessageCount(
    query: QueryChannels
  ): Promise<GetChannelMessagesCountDto[]> {
    const channels: ChannelEntity[] = await this.queryChannels(query);

    const result: GetChannelMessagesCountDto[] = [];

    for (const channel of channels) {
      const dataToPush: GetChannelMessagesCountDto = {
        count: await this.getChannelMessageCount(channel.fqcn),
        fqcn: channel.fqcn,
      };

      result.push(dataToPush);
    }

    return result;
  }

  @Span('channels_messageCount')
  public async getChannelMessageCount(fqcn: string): Promise<number> {
    const channel: ChannelEntity = await this.getChannelOrThrow(fqcn);

    if (!channel.messageForms) {
      throw new ChannelMessageFormsOnlyException(fqcn);
    }

    if (channel.type === ChannelType.PUB) {
      return this.sentMessagesRepositoryWrapper.repository.count({
        where: {
          fqcn,
        },
      });
    } else {
      return this.receivedMessagesRepositoryWrapper.repository.count({
        where: {
          fqcn,
        },
      });
    }
  }

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

    this.logger.debug(`Create message payload: ${JSON.stringify(payload)}`);

    let responseTopicsWithChannels: ChannelResponseTopic[] = [];
    if (payload.conditions.responseTopics.length) {
      const responseTopicsWithIds: ChannelTopic[] = await this.getTopicsWithIds(
        payload.conditions.responseTopics
      );

      const uniqueResponseTopicsIds: string[] = [
        ...new Set(
          payload.conditions.responseTopics.map(
            ({ responseTopicId }) => responseTopicId
          )
        ),
      ];

      const responseTopicsCount = await this.getTopicsCountByIds(
        uniqueResponseTopicsIds
      );

      responseTopicsWithChannels = this.verifyResponseTopics(
        responseTopicsCount,
        uniqueResponseTopicsIds,
        payload.conditions.responseTopics,
        responseTopicsWithIds
      );
    }

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
      messageForms: payload.messageForms,
      useAnonymousExtChannel: payload.useAnonymousExtChannel,
      payloadEncryption: payload.payloadEncryption,
      conditions: {
        topics: topicsWithIds,
        dids: payload.conditions.dids,
        roles: payload.conditions.roles,
        qualifiedDids: [],
        responseTopics: responseTopicsWithChannels,
      },
    });

    this.logger.log(`Channel with name ${payload.fqcn} created`);

    await this.commandBus.execute(
      new RefreshChannelCacheDataCommand(payload.fqcn)
    );
  }

  private verifyResponseTopics(
    responseTopicsCount: number,
    uniqueResponseTopicsIds: string[],
    responseTopics: ResponseTopicDto[],
    responseTopicsWithIds: ChannelTopic[]
  ) {
    if (responseTopicsCount !== uniqueResponseTopicsIds.length) {
      throw new TopicNotFoundException(
        `found ${responseTopicsCount} topics expected ${uniqueResponseTopicsIds}`
      );
    }

    const responseTopicsWithChannels: ChannelResponseTopic[] =
      responseTopics.map(({ topicName, owner, responseTopicId }) => {
        const validTopic: ChannelTopic | undefined = responseTopicsWithIds.find(
          (topic) => topic.topicName === topicName && topic.owner === owner
        );

        if (!validTopic) {
          throw new TopicNotFoundException(validTopic.topicId);
        }

        return {
          topicOwner: owner,
          responseTopicId: responseTopicId,
          topicId: validTopic.topicId,
          topicName: topicName,
        };
      });
    return responseTopicsWithChannels;
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
      channel.type !== dto.type ||
      channel.fqcn !== fqcn ||
      (channel.useAnonymousExtChannel !== dto.useAnonymousExtChannel &&
        dto.useAnonymousExtChannel !== undefined);

    if (hasChangedRestrictedFields) {
      throw new ChannelUpdateRestrictedFieldsException();
    }

    const topicsWithIds: ChannelTopic[] = await this.getTopicsWithIds(
      dto.conditions.topics
    );

    let responseTopicsWithChannels: ChannelResponseTopic[] = [];
    if (dto.conditions.responseTopics.length) {
      const responseTopicsWithIds: ChannelTopic[] = await this.getTopicsWithIds(
        dto.conditions.responseTopics
      );

      const uniqueResponseTopicsIds: string[] = [
        ...new Set(
          dto.conditions.responseTopics.map(
            ({ responseTopicId }) => responseTopicId
          )
        ),
      ];

      const responseTopicsCount = await this.getTopicsCountByIds(
        uniqueResponseTopicsIds
      );

      responseTopicsWithChannels = this.verifyResponseTopics(
        responseTopicsCount,
        uniqueResponseTopicsIds,
        dto.conditions.responseTopics,
        responseTopicsWithIds
      );
    }

    await this.validateTopics(topicsWithIds, channel.type);

    channel.payloadEncryption =
      dto.payloadEncryption ?? channel.payloadEncryption;

    channel.conditions = {
      ...channel.conditions,
      dids: dto.conditions.dids,
      roles: dto.conditions.roles,
      topics: topicsWithIds,
      responseTopics: responseTopicsWithChannels,
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

  protected async getTopicsCountByIds(topicIds: string[]): Promise<number> {
    if (!topicIds || topicIds.length === 0) {
      return 0;
    }

    const [, count] =
      await this.topicRepository.topicRepository.getTopicsAndCountByIds(
        topicIds,
        true
      );
    return count;
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

        continue;
      }

      const { id, schemaType }: Topic = receivedTopics.records[0];

      topicsToReturn.push({
        topicName,
        owner,
        topicId: id,
        schemaType,
      });
    }

    const invalidTopics = differenceBy(topics, topicsToReturn, 'topicName');
    if (invalidTopics.length > 0) {
      throw new TopicNotFoundException(
        `Topics not found: ${invalidTopics
          .map(({ owner, topicName }) => `${topicName} (owner: ${owner})`)
          .join(', ')}.`
      );
    }

    return topicsToReturn;
  }

  @Span('channels_getChannelsByType')
  public async queryChannels(query: QueryChannels): Promise<ChannelEntity[]> {
    return this.wrapperRepository.fetch(query);
  }
}
