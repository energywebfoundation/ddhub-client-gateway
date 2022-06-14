import {
  DdhubFilesService,
  DdhubMessagesService,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import {
  ChannelEntity,
  TopicEntity,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { ChannelType } from '../../../modules/channel/channel.const';
import { ChannelService } from '../../channel/service/channel.service';
import { TopicService } from '../../channel/service/topic.service';
import { KeysService } from '../../keys/service/keys.service';
import {
  EncryptedMessageType,
  EncryptionStatus,
} from '../../message/message.const';
import { NoPrivateKeyException } from '../../storage/exceptions/no-private-key.exception';
import { IsSchemaValid } from '../../utils/validator/decorators/IsSchemaValid';
import { GetMessagesDto } from '../dto/request/get-messages.dto';
import {
  SendMessageDto,
  uploadMessageBodyDto,
} from '../dto/request/send-message.dto';
import { ChannelTypeNotPubException } from '../exceptions/channel-type-not-pub.exception';
import { FileSizeException } from '../exceptions/file-size.exception';
import { FileTypeNotSupportedException } from '../exceptions/file-type-not-supported.exception';
import { MessageDecryptionFailedException } from '../exceptions/message-decryption-failed.exception';
import { MessageSignatureNotValidException } from '../exceptions/messages-signature-not-valid.exception';
import { RecipientsNotFoundException } from '../exceptions/recipients-not-found-exception';
import { TopicNotFoundException } from '../exceptions/topic-not-found.exception';
import { TopicNotRelatedToChannelException } from '../exceptions/topic-not-related-to-channel.exception';
import { TopicOwnerTopicNameRequiredException } from '../exceptions/topic-owner-and-topic-name-required.exception';
import { EventsGateway } from '../gateway/events.gateway';
import {
  DownloadMessageResponse,
  GetMessageResponse,
  SearchMessageResponseDto,
  SendMessageResponse,
} from '../message.interface';
import { WsClientService } from './ws-client.service';
import { Span } from 'nestjs-otel';
import { FileNameInvalidException } from '../exceptions/file-name-invalid.exception';

export enum EventEmitMode {
  SINGLE = 'SINGLE',
  BULK = 'BULK',
}

@Injectable()
export class MessageService {
  protected readonly logger = new Logger(MessageService.name);

  constructor(
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly gateway: EventsGateway,
    protected readonly wsClient: WsClientService,
    protected readonly configService: ConfigService,
    protected readonly channelService: ChannelService,
    protected readonly topicService: TopicService,
    protected readonly keyService: KeysService,
    protected readonly ddhubMessageService: DdhubMessagesService,
    protected readonly ddhubFilesService: DdhubFilesService
  ) { }

  @Span('message_sendMessage')
  public async sendMessage(dto: SendMessageDto): Promise<SendMessageResponse> {
    const channel: ChannelEntity = await this.channelService.getChannelOrThrow(
      dto.fqcn
    );

    const topic: TopicEntity = await this.topicService.getTopic(
      dto.topicName,
      dto.topicOwner,
      dto.topicVersion
    );

    this.validateTopic(topic, channel);

    const qualifiedDids = channel.conditions.qualifiedDids;

    if (qualifiedDids.length === 0) {
      throw new RecipientsNotFoundException();
    }

    if (channel.type !== ChannelType.PUB) {
      throw new ChannelTypeNotPubException(channel.fqcn);
    }
    const clientGatewayMessageId: string = uuidv4();

    // @TODO this is not a ideal solution, change once new logger is introduced
    const messageLoggerContext = new Logger(
      MessageService.name + '_' + clientGatewayMessageId
    );

    messageLoggerContext.debug('validating schema');
    IsSchemaValid(topic.schemaType, topic.schema, dto.payload);

    messageLoggerContext.debug('generating random key');
    const randomKey: string = this.keyService.generateRandomKey();

    messageLoggerContext.debug(
      'attempting to encrypt payload, encryption enabled: ' +
      channel.payloadEncryption
    );

    const message = channel.payloadEncryption
      ? this.keyService.encryptMessage(
        dto.payload,
        randomKey,
        EncryptedMessageType['UTF-8']
      )
      : dto.payload;

    messageLoggerContext.debug('fetching private key');
    const privateKey = await this.secretsEngineService.getPrivateKey();

    if (!privateKey) {
      throw new NoPrivateKeyException();
    }

    messageLoggerContext.debug('generating signature');

    const signature = this.keyService.createSignature(
      message,
      '0x' + privateKey
    );

    if (channel.payloadEncryption) {
      messageLoggerContext.debug('sending symmetric keys');

      await this.sendSymmetricKeys(
        messageLoggerContext,
        qualifiedDids,
        randomKey,
        clientGatewayMessageId
      );
    }

    messageLoggerContext.debug(
      `sending messages to ${qualifiedDids.length} DIDs`
    );

    return this.ddhubMessageService.sendMessage(
      qualifiedDids,
      message,
      topic.id,
      topic.version,
      signature,
      clientGatewayMessageId,
      channel.payloadEncryption,
      dto.transactionId
    );
  }

  @Span('message_sendSymmetricKeys')
  protected async sendSymmetricKeys(
    contextLogger: Logger,
    qualifiedDids: string[],
    decryptionKey: string,
    clientGatewayMessageId: string
  ): Promise<void> {
    await Promise.allSettled(
      qualifiedDids.map(async (recipientDid: string) => {
        const encryptedSymmetricKey = await this.keyService.encryptSymmetricKey(
          decryptionKey,
          recipientDid
        );
        await this.ddhubMessageService.sendMessageInternal(
          recipientDid,
          clientGatewayMessageId,
          encryptedSymmetricKey
        );

        contextLogger.debug(`send symmetric key to ${recipientDid}`);
      })
    ).catch((e) => {
      contextLogger.error(
        'Error while Sending CipherText as Internal Message to recipients',
        e
      );

      throw new Error(e);
    });
  }

  protected async getTopicsIds(
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
        this.logger.error(
          `Couldn't find topic - topicName: ${topicName}, owner: ${topicOwner}`
        );

        return [];
      }

      topicIds.push(topic.id);
    }

    return topicIds;
  }

  @Span('message_processMessage')
  private async processMessage(
    payloadEncryption: boolean,
    topic: TopicEntity,
    message: SearchMessageResponseDto
  ): Promise<GetMessageResponse> {
    const baseMessage: Omit<
      GetMessageResponse,
      'signatureValid' | 'decryption'
    > = {
      id: message.messageId,
      topicName: topic.name,
      topicOwner: topic.owner,
      topicVersion: message.topicVersion,
      topicSchemaType: topic.schemaType,
      payload: message.payload,
      signature: message.signature,
      sender: message.senderDid,
      timestampNanos: message.timestampNanos,
      transactionId: message.transactionId,
    };

    if (message.isFile) {
      return {
        ...baseMessage,
        signatureValid: EncryptionStatus.NOT_REQUIRED,
        decryption: {
          status: EncryptionStatus.NOT_REQUIRED,
        },
      };
    }

    const isSignatureValid: boolean = await this.keyService.verifySignature(
      message.senderDid,
      message.signature,
      message.payload
    );

    if (!payloadEncryption && message.payloadEncryption) {
      return {
        ...baseMessage,
        signatureValid: isSignatureValid
          ? EncryptionStatus.SUCCESS
          : EncryptionStatus.FAILED,
        decryption: {
          status: EncryptionStatus.REQUIRED_NOT_PERFORMED,
        },
      };
    }

    if (!payloadEncryption) {
      return {
        ...baseMessage,
        signatureValid: isSignatureValid
          ? EncryptionStatus.SUCCESS
          : EncryptionStatus.FAILED,
        decryption: {
          status: EncryptionStatus.NOT_REQUIRED,
        },
      };
    }

    if (!isSignatureValid) {
      return {
        ...baseMessage,
        signatureValid: EncryptionStatus.FAILED,
        decryption: {
          status: EncryptionStatus.NOT_PERFORMED,
        },
      };
    }

    const decryptedMessage: string | null =
      await this.keyService.decryptMessage(
        message.payload,
        message.clientGatewayMessageId,
        message.senderDid
      );

    if (!decryptedMessage) {
      return {
        ...baseMessage,
        signatureValid: EncryptionStatus.SUCCESS,
        decryption: {
          status: EncryptionStatus.FAILED,
          errorMessage: '',
        },
      };
    }

    return {
      ...baseMessage,
      signatureValid: EncryptionStatus.SUCCESS,
      decryption: {
        status: EncryptionStatus.SUCCESS,
      },
      payload: decryptedMessage,
    };
  }

  @Span('message_getMessages')
  public async getMessages({
    fqcn,
    from,
    amount,
    topicName,
    topicOwner,
    clientId,
  }: GetMessagesDto): Promise<GetMessageResponse[]> {
    const loggerContextKey: string = `${MessageService.name}_${fqcn}_${topicName}_${topicOwner}_${clientId};`;

    const messageLoggerContext = new Logger(loggerContextKey);

    messageLoggerContext.debug('attempting to receive messages');

    const channel: ChannelEntity = await this.channelService.getChannelOrThrow(
      fqcn
    );

    const topicsIds: string[] = await this.getTopicsIds(
      channel,
      topicOwner,
      topicName
    );

    messageLoggerContext.debug(`found topics`, topicsIds);

    const messages: Array<SearchMessageResponseDto> =
      await this.ddhubMessageService.messagesSearch(
        topicsIds,
        channel.conditions.qualifiedDids,
        `${clientId}.${fqcn}`,
        from,
        amount
      );

    //no messages then return empty array
    if (messages.length === 0) {
      messageLoggerContext.debug('no messages found');

      return [];
    }

    const getMessagesResponse: GetMessageResponse[] = [];

    await Promise.allSettled(
      messages.map(async (message: SearchMessageResponseDto) => {
        const topic: TopicEntity = await this.topicService.getTopicById(
          message.topicId
        );

        messageLoggerContext.debug(`processing message ${message.messageId}`);

        const processedMessage: GetMessageResponse = await this.processMessage(
          channel.payloadEncryption,
          topic,
          message
        );

        getMessagesResponse.push(processedMessage);
      })
    );

    return getMessagesResponse;
  }

  public async uploadMessage(
    file: Express.Multer.File,
    dto: uploadMessageBodyDto
  ): Promise<SendMessageResponse> {
    // file validations
    if (!file.originalname.match(/\.(csv)$/)) {
      throw new FileTypeNotSupportedException();
    }

    const maxFileSize = this.configService.get('MAX_FILE_SIZE');

    if (file.size > maxFileSize) {
      throw new FileSizeException(maxFileSize);
    }

    //Check if internal channel exists
    const channel: ChannelEntity = await this.channelService.getChannelOrThrow(
      dto.fqcn
    );

    //System gets topic details from cache
    const topic: TopicEntity | null = await this.topicService.getTopic(
      dto.topicName,
      dto.topicOwner,
      dto.topicVersion
    );

    this.validateTopic(topic, channel);

    //System gets internal channel details
    const qualifiedDids = channel.conditions.qualifiedDids;

    // return error if no recipients
    if (qualifiedDids.length === 0) {
      throw new RecipientsNotFoundException();
    }

    if (channel.type !== ChannelType.UPLOAD) {
      throw new ChannelTypeNotPubException(channel.fqcn);
    }

    this.logger.log('generating Client Gateway Message Id');
    const clientGatewayMessageId: string = uuidv4();

    this.logger.log('Generating Random Key');
    const randomKey: string = this.keyService.generateRandomKey();

    this.logger.log('Encrypting Payload', channel.payloadEncryption);

    const encryptedMessage = channel.payloadEncryption
      ? this.keyService.encryptMessage(
        JSON.stringify(file.buffer),
        randomKey,
        EncryptedMessageType['UTF-8']
      )
      : JSON.stringify(file.buffer);

    this.logger.log('fetching private key');
    const privateKey = await this.secretsEngineService.getPrivateKey();

    if (!privateKey) {
      throw new NoPrivateKeyException();
    }

    this.logger.log('Generating Signature');
    const dataHash = this.keyService.createHash(encryptedMessage);
    const signature = this.keyService.createSignature(
      dataHash,
      '0x' + privateKey
    );

    this.logger.log(
      'Sending CipherText as Internal Message to all qualified dids'
    );

    await this.sendSymmetricKeys(
      this.logger,
      qualifiedDids,
      randomKey,
      clientGatewayMessageId
    );

    //uploading file
    return this.ddhubFilesService.uploadFile(
      file,
      qualifiedDids,
      topic.id,
      topic.version,
      signature,
      encryptedMessage,
      clientGatewayMessageId,
      channel.payloadEncryption,
      dto.transactionId
    );
  }

  public async downloadMessages(
    fileId: string
  ): Promise<DownloadMessageResponse> {
    //Calling download file API of message broker
    const fileResponse = await this.ddhubFilesService.downloadFile(fileId);
    let decrypted: { data: string };

    const regExpFilename = /filename="(?<filename>.*)"/;

    //validating file name
    let fileName: string | null =
      regExpFilename.exec(fileResponse.headers['content-disposition'])?.groups
        ?.filename ?? null;

    if (!fileName) {
      throw new FileNameInvalidException();
    }

    fileName = fileName.replace(/"/g, '');

    const encryptionEnabled: boolean =
      fileResponse.headers.payloadencryption === 'true';

    //Verifying signature
    const isSignatureValid: boolean = await this.keyService.verifySignature(
      fileResponse.headers.ownerdid,
      fileResponse.headers.signature,
      this.keyService.createHash(
        encryptionEnabled
          ? fileResponse.data
          : JSON.stringify(fileResponse.data)
      )
    );

    // Return error that signature is invalid
    if (!isSignatureValid) {
      this.logger.error(`Signature not matched for file id: ${fileId}`);

      throw new MessageSignatureNotValidException(
        fileId,
        fileResponse.headers.signature
      );
    } else {
      let decryptedMessage: string;

      try {
        // Decrypting File Content
        this.logger.debug(`decrypting Message for File Id  ${fileId}`);

        decryptedMessage = encryptionEnabled
          ? await this.keyService.decryptMessage(
            fileResponse.data,
            fileResponse.headers.clientgatewaymessageid,
            fileResponse.headers.ownerdid
          )
          : fileResponse.data;

        this.logger.debug(`Completed decryption for file id:${fileId}`);
      } catch (e) {
        this.logger.debug(`Decryption failed for file id:${fileId}`);
        throw new MessageDecryptionFailedException(JSON.stringify(e));
      }

      if (!decryptedMessage) {
        throw new MessageDecryptionFailedException();
      }

      try {
        // Parsing Decrypted data
        decrypted = encryptionEnabled
          ? JSON.parse(decryptedMessage)
          : decryptedMessage;
      } catch (e) {
        this.logger.debug(`Parsing failed for file id:${fileId}`);
        throw new MessageDecryptionFailedException(
          'Decryted Message cannot be parsed to JSON object.'
        );
      }
    }

    return {
      fileName: fileName,
      sender: fileResponse.headers.ownerdid,
      signature: fileResponse.headers.signature,
      clientGatewayMessageId: fileResponse.headers.clientgatewaymessageid,
      data: Buffer.from(decrypted.data),
    };
  }

  private validateTopic(topic: TopicEntity, channel: ChannelEntity): void {
    if (
      !topic ||
      !topic.id ||
      !topic.schema ||
      !topic.schemaType ||
      !topic.version
    ) {
      throw new TopicNotFoundException(topic.id);
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
