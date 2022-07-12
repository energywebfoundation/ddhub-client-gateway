import { Injectable, Logger } from '@nestjs/common';
import {
  MessageFactoryService,
  MessagingType,
  RsaService,
} from '@dsb-client-gateway/ddhub-client-gateway-messaging';
import {
  SendMessageDto,
  uploadMessageBodyDto,
} from '../dto/request/send-message.dto';
import { ChannelService } from '../../channel/service/channel.service';
import { TopicService } from '../../channel/service/topic.service';
import {
  ChannelEntity,
  ChannelType,
  TopicEntity,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { TopicNotFoundException } from '../exceptions/topic-not-found.exception';
import { TopicNotRelatedToChannelException } from '../exceptions/topic-not-related-to-channel.exception';
import { v4 as uuidv4 } from 'uuid';
import { GetMessagesDto } from '../dto/request/get-messages.dto';
import { TopicOwnerTopicNameRequiredException } from '../exceptions/topic-owner-and-topic-name-required.exception';
import { DdhubMessagesService } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import {
  DownloadMessageResponse,
  SearchMessageResponseDto,
} from '../message.interface';
import * as fs from 'fs';
import { FileSizeException } from '../exceptions/file-size.exception';
import { ConfigService } from '@nestjs/config';
import { ChannelTypeNotPubException } from '../exceptions/channel-type-not-pub.exception';
import { RecipientsNotFoundException } from '../exceptions/recipients-not-found-exception';

@Injectable()
export class AService {
  protected readonly logger = new Logger(AService.name);

  constructor(
    protected readonly channelService: ChannelService,
    protected readonly topicService: TopicService,
    protected readonly messageFactoryService: MessageFactoryService,
    protected readonly ddhubMessageService: DdhubMessagesService,
    protected readonly configService: ConfigService
  ) {}

  public async downloadMessage(
    fileId: string
  ): Promise<DownloadMessageResponse> {
    const messageService: RsaService =
      this.messageFactoryService.create<RsaService>(MessagingType.RSA);

    return await messageService.downloadMessages({ fileId });
  }

  public async uploadMessage(
    file: Express.Multer.File,
    dto: uploadMessageBodyDto
  ): Promise<any> {
    file.stream = fs.createReadStream(file.path);

    if (file.mimetype !== 'text/csv') {
      throw new Error('todo implement error');
    }

    const maxFileSize = this.configService.get<number>('MAX_FILE_SIZE');

    if (file.size > maxFileSize) {
      throw new FileSizeException(maxFileSize);
    }

    const [channel, topic]: [ChannelEntity, TopicEntity] = await Promise.all([
      this.channelService.getChannelOrThrow(dto.fqcn),
      this.topicService.getTopicOrThrow(
        dto.topicName,
        dto.topicOwner,
        dto.topicVersion
      ),
    ]);

    this.validateTopic(topic, channel);

    if (channel.type !== ChannelType.UPLOAD) {
      throw new ChannelTypeNotPubException(channel.fqcn);
    }

    if (!channel.conditions.qualifiedDids.length) {
      throw new RecipientsNotFoundException();
    }

    const clientGatewayMessageId: string = uuidv4();

    const messageService: RsaService =
      this.messageFactoryService.create<RsaService>(MessagingType.RSA);

    return messageService.uploadMessage({
      file,
      topic,
      channel,
      clientGatewayMessageId,
      transactionId: dto.transactionId,
    });
  }

  public async getMessages(dto: GetMessagesDto): Promise<any> {
    const channel: ChannelEntity = await this.channelService.getChannelOrThrow(
      dto.fqcn
    );

    const topicsIds: string[] = await this.getTopicsIds(
      channel,
      dto.topicOwner,
      dto.topicName
    );

    const messages: Array<SearchMessageResponseDto> =
      await this.ddhubMessageService.messagesSearch(
        topicsIds,
        channel.conditions.qualifiedDids,
        `${dto.clientId}:${channel.fqcn}`,
        dto.from,
        dto.amount
      );

    if (messages.length === 0) {
      return;
    }

    const messageService: RsaService =
      this.messageFactoryService.create<RsaService>(MessagingType.RSA);

    return messageService.getMessages({
      messages,
      channel,
    });
  }

  public async sendMessage(dto: SendMessageDto): Promise<any> {
    const channel: ChannelEntity = await this.channelService.getChannelOrThrow(
      dto.fqcn
    );

    const topic: TopicEntity = await this.topicService.getTopic(
      dto.topicName,
      dto.topicOwner,
      dto.topicVersion
    );

    this.validateTopic(topic, channel);

    const messageService: RsaService =
      this.messageFactoryService.create<RsaService>(MessagingType.RSA);

    return messageService.sendMessage({
      payload: dto.payload,
      topic,
      channel,
      clientGatewayMessageId: uuidv4(),
      transactionId: dto.transactionId,
    });
  }

  private async getTopicsIds(
    channel: ChannelEntity,
    topicOwner,
    topicName
  ): Promise<string[]> {
    // topic owner and topic name should be present
    if ((topicOwner && !topicName) || (!topicOwner && topicName)) {
      throw new TopicOwnerTopicNameRequiredException();
    }

    //Get Topic Ids
    let topicIds = [];
    if (!topicName && !topicOwner) {
      topicIds = channel.conditions.topics.map((topic) => topic.topicId);
    } else {
      const topic: TopicEntity = await this.topicService.getTopic(
        topicName,
        topicOwner
      );

      if (!topic) {
        // this.logger.error(
        //   `Couldn't find topic - topicName: ${topicName}, owner: ${topicOwner}`
        // );

        return [];
      }

      topicIds.push(topic.id);
    }

    return topicIds;
  }

  private validateTopic(topic: TopicEntity, channel: ChannelEntity): void {
    if (
      !topic ||
      !topic.id ||
      !topic.schema ||
      !topic.schemaType ||
      !topic.version
    ) {
      if (!topic) throw new TopicNotFoundException('');
      else throw new TopicNotFoundException(topic.id);
    }

    const isTopicNotRelatedToChannel: boolean = this.checkTopicForChannel(
      channel,
      topic
    );

    if (isTopicNotRelatedToChannel) {
      throw new TopicNotRelatedToChannelException();
    }
  }

  private checkTopicForChannel(
    channel: ChannelEntity,
    topic: TopicEntity
  ): boolean {
    return !channel.conditions.topics.find(
      (topicOfChannel) => topicOfChannel.topicId === topic.id
    );
  }
}
