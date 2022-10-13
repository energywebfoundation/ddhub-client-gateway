import {
  AckResponse,
  DdhubFilesService,
  DdhubMessagesService,
  SendMessageResponseFile,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import {
  ChannelEntity,
  ChannelTopic,
  FileMetadataEntity,
  FileMetadataWrapperRepository,
  PendingAcksEntity,
  PendingAcksWrapperRepository,
  TopicEntity,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
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
import * as fs from 'fs';
import { FileSizeException } from '../exceptions/file-size.exception';
import { join } from 'path';
import { FileTypeNotSupportedException } from '../exceptions/file-type-not-supported.exception';
import { MessageSignatureNotValidException } from '../exceptions/messages-signature-not-valid.exception';
import { ReqLockExistsException } from '../exceptions/req-lock-exists.exception';
import { ReqLockService } from './req-lock.service';
import moment from 'moment';
import { In } from 'typeorm';

export enum EventEmitMode {
  SINGLE = 'SINGLE',
  BULK = 'BULK',
}

@Injectable()
export class MessageService {
  protected readonly logger = new Logger(MessageService.name);
  protected readonly uploadPath: string;
  protected readonly downloadPath: string;
  protected readonly ext: string = '.enc';

  constructor(
    protected readonly secretsEngineService: SecretsEngineService,
    @Inject(forwardRef(() => EventsGateway))
    protected readonly gateway: EventsGateway,
    protected readonly wsClient: WsClientService,
    protected readonly configService: ConfigService,
    protected readonly channelService: ChannelService,
    protected readonly topicService: TopicService,
    protected readonly keyService: KeysService,
    protected readonly ddhubMessageService: DdhubMessagesService,
    protected readonly ddhubFilesService: DdhubFilesService,
    protected readonly fileMetadataWrapper: FileMetadataWrapperRepository,
    protected readonly reqLockService: ReqLockService,
    protected readonly pendingAcksWrapperRepository: PendingAcksWrapperRepository,
  ) {
    this.uploadPath = configService.get<string>('UPLOAD_FILES_DIR');
    this.downloadPath = configService.get<string>('DOWNLOAD_FILES_DIR');
  }

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
      privateKey.length === 66 ? privateKey : '0x' + privateKey
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

    const result: SendMessageResponse =
      await this.ddhubMessageService.sendMessage(
        qualifiedDids,
        message,
        topic.id,
        topic.version,
        signature,
        clientGatewayMessageId,
        channel.payloadEncryption,
        dto.transactionId
      );

    for (const res of result.status) {
      for (const detail of res.details) {
        this.logger.log(
          `message sent with id ${detail.messageId} to ${detail.did} with status code ${detail.statusCode}`
        );
      }
    }

    return result;
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

      const hasNonBoundTopics: ChannelTopic | undefined =
        channel.conditions.topics.find(
          (channelTopic: ChannelTopic) =>
            topicName === channelTopic.topicName &&
            channelTopic.owner === topicOwner
        );

      if (!hasNonBoundTopics) {
        throw new TopicNotRelatedToChannelException();
      }

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
    message: SearchMessageResponseDto
  ): Promise<GetMessageResponse> {
    let baseMessage: Omit<GetMessageResponse, 'signatureValid' | 'decryption'> =
    {
      id: message.messageId,
      topicVersion: message.topicVersion,
      topicName: '',
      topicOwner: '',
      topicSchemaType: '',
      payload: message.payload,
      signature: message.signature,
      sender: message.senderDid,
      timestampNanos: message.timestampNanos,
      transactionId: message.transactionId,
    };

    try {
      const topic: TopicEntity = await this.topicService.getTopicById(
        message.topicId
      );

      baseMessage = {
        ...baseMessage,
        topicName: topic.name,
        topicOwner: topic.owner,
        topicSchemaType: topic.schemaType,
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

      /* TODO: fix predicate, this won't run currently.
      Reads as: !message.payloadEncryption && message.payloadEncryption
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
      } */

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

      const { decrypted, error } = await this.keyService.decryptMessage(
        message.payload,
        message.clientGatewayMessageId,
        message.senderDid
      );

      if (error) {
        return {
          ...baseMessage,
          signatureValid: EncryptionStatus.SUCCESS,
          decryption: {
            status: EncryptionStatus.ERROR,
            errorMessage: error,
          },
        };
      }

      return {
        ...baseMessage,
        signatureValid: EncryptionStatus.SUCCESS,
        decryption: {
          status: EncryptionStatus.SUCCESS,
        },
        payload: decrypted,
      };
    } catch (e) {
      this.logger.error(
        `Error while processing message - messageId: ${message.messageId} topicId: ${message.topicId}`,
        e
      );

      return {
        ...baseMessage,
        signatureValid: EncryptionStatus.ERROR,
        decryption: {
          status: EncryptionStatus.ERROR,
          errorMessage: e.message,
        },
      };
    }
  }

  @Span('message_sendAckBy')
  public async sendAckBy(
    messageIds: string[],
    clientId: string
  ): Promise<AckResponse> {
    this.logger.log(messageIds);
    const successAckMessageIds: AckResponse =
      await this.ddhubMessageService.messagesAckBy(messageIds, clientId);
    return successAckMessageIds;
  }

  @Span('message_getMessages_reqLock')
  public async getMessagesWithReqLock(
    { fqcn, from, amount, topicName, topicOwner, clientId }: GetMessagesDto,
    ack: boolean | undefined = true
  ): Promise<GetMessageResponse[]> {
    try {
      const usableClientId: string = clientId ? clientId : 'DEFAULT';

      await this.reqLockService.attemptLock(usableClientId, fqcn);

      const messages: GetMessageResponse[] = await this.getMessages(
        { fqcn, from, amount, topicName, topicOwner, clientId },
        ack
      );

      await this.reqLockService.clearLock(clientId, fqcn);

      return messages;
    } catch (e) {
      if (e instanceof ReqLockExistsException) {
        return [];
      }

      await this.reqLockService.clearLock(clientId, fqcn);

      this.logger.error(`something went wrong when fetching messages`);

      this.logger.error(e);

      throw e;
    }
  }

  @Span('message_getMessages')
  public async getMessages(
    { fqcn, from, amount, topicName, topicOwner, clientId }: GetMessagesDto,
    ack: boolean | undefined = true
  ): Promise<GetMessageResponse[]> {
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

    const consumer = `${clientId}:${fqcn}`;

    if (ack) {
      const data: PendingAcksEntity[] = await this.pendingAcksWrapperRepository.pendingAcksRepository.find({
        where: {
          clientId: consumer
        },
      });
      if (data.length > 0) {
        const idsPendingAck: string[] = data.map(e => e.messageId);

        const ackResponse: AckResponse = await this.sendAckBy(
          idsPendingAck,
          consumer
        ).catch(e => {
          return {
            acked: [], notFound: []
          }
        });

        if (ackResponse.notFound.length > 0) {
          this.pendingAcksWrapperRepository.pendingAcksRepository.delete({
            messageId: In(ackResponse.notFound),
            clientId: consumer
          }).then();
        }

        if (ackResponse.acked.length === 0 && ackResponse.notFound.length === 0) {
          return [];
        } else {
          this.pendingAcksWrapperRepository.pendingAcksRepository.delete({
            messageId: In(ackResponse.acked),
            clientId: consumer
          }).then();
        }
      }

    }


    const messages: Array<SearchMessageResponseDto> =
      await this.ddhubMessageService.messagesSearch(
        topicsIds,
        channel.conditions.qualifiedDids,
        `${clientId}:${fqcn}`,
        from,
        amount
      );

    //no messages then return empty array
    if (messages.length === 0) {
      messageLoggerContext.debug('no messages found');

      return [];
    }

    const messageResponses = await Promise.allSettled(
      messages.map(async (message): Promise<GetMessageResponse> => {
        messageLoggerContext.debug(`processing message ${message.messageId}`);

        const processedMessage: GetMessageResponse = await this.processMessage(
          message.payloadEncryption,
          message
        );

        return processedMessage;
      })
    );

    const rejected = messageResponses.filter(
      (value) => value.status === 'rejected'
    );
    if (rejected.length > 0) {
      messageLoggerContext.error(
        '[getMessages] Error while processing messages',
        rejected.map((value) =>
          value.status === 'rejected' ? value.reason : value
        )
      );
    }

    messageLoggerContext.log(
      `[getMessages] Total message broker messages ${messages.length}`
    );
    messageLoggerContext.log(
      `[getMessages] Total returned (fulfilled/rejected) messages ${messageResponses.length}`
    );
    messageLoggerContext.log(
      '[getMessages] Returned processed messages',
      messageResponses
    );
    let fulfilledMessages = messageResponses
      .map((message) => (message.status === 'fulfilled' ? message.value : null))
      .filter(
        (message: GetMessageResponse | null) => !!message
      ) as GetMessageResponse[];

    messageLoggerContext.log(
      `[getMessages] Total fulfilled messages ${messageResponses.length}`
    );

    const idsPendingAck: PendingAcksEntity[] = fulfilledMessages.map(e => {
      return {
        clientId: consumer,
        messageId: e.id,
        mbTimestamp: moment(e.timestampNanos / (1000 * 1000)).utc().toDate()
      }
    });

    if (idsPendingAck.length > 0) {
      this.pendingAcksWrapperRepository.pendingAcksRepository.save(idsPendingAck).then();
    }

    return fulfilledMessages.sort((a, b) => {
      if (a.timestampNanos < b.timestampNanos) return -1;
      return a.timestampNanos > b.timestampNanos ? 1 : 0;
    });
  }

  public async uploadMessage(
    file: Express.Multer.File,
    dto: uploadMessageBodyDto
  ): Promise<SendMessageResponse> {
    file.stream = fs.createReadStream(file.path);

    if (file.mimetype !== 'text/csv') {
      throw new FileTypeNotSupportedException();
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

    const qualifiedDids: string[] = channel.conditions.qualifiedDids;

    if (channel.type !== ChannelType.UPLOAD) {
      throw new ChannelTypeNotPubException(channel.fqcn);
    }

    if (!qualifiedDids.length) {
      throw new RecipientsNotFoundException();
    }

    const clientGatewayMessageId: string = uuidv4();

    const symmetricKey: string = this.keyService.generateRandomKey();

    let filePath: string;

    if (channel.payloadEncryption) {
      filePath = await this.keyService.encryptMessageStream(
        file.stream,
        symmetricKey,
        clientGatewayMessageId
      );
    } else {
      filePath = join(this.uploadPath, clientGatewayMessageId + this.ext);

      const stream = fs.createWriteStream(filePath);

      const writeStream = file.stream.pipe(stream);

      const promise = () =>
        new Promise((resolve) => {
          writeStream.on('finish', () => resolve(null));
        });

      await promise();
    }

    const privateKey = await this.secretsEngineService.getPrivateKey();
    const checksum = await this.keyService.checksumFile(filePath);

    const signature = this.keyService.createSignature(
      checksum,
      privateKey.length === 66 ? privateKey : '0x' + privateKey
    );

    await this.sendSymmetricKeys(
      this.logger,
      qualifiedDids,
      symmetricKey,
      clientGatewayMessageId
    );

    //uploading file
    const result: SendMessageResponseFile =
      await this.ddhubFilesService.uploadFile(
        fs.createReadStream(filePath),
        file.originalname,
        qualifiedDids,
        topic.id,
        topic.version,
        signature,
        clientGatewayMessageId,
        channel.payloadEncryption,
        dto.transactionId
      );

    try {
      fs.unlinkSync(filePath);
      fs.unlinkSync(file.path);
    } catch (e) {
      this.logger.error('file unlink failed', e);
    }

    return result;
  }

  public async downloadMessages(
    fileId: string
  ): Promise<DownloadMessageResponse> {
    const fileMetadata: FileMetadataEntity = await this.createMetadata(fileId);

    const fullPath: string = join(this.downloadPath, fileId + this.ext);

    const isSignatureValid: boolean = await this.keyService.verifySignature(
      fileMetadata.did,
      fileMetadata.signature,
      await this.keyService.checksumFile(fullPath)
    );

    if (!isSignatureValid) {
      this.logger.error(`invalid signature for file ${fileId}`);
      throw new MessageSignatureNotValidException(
        fileId,
        fileMetadata.signature
      );
    }

    if (!fileMetadata.encrypted) {
      this.logger.error(`returning unencrypted file`);

      return {
        fileName: fileId,
        sender: fileMetadata.did,
        signature: fileMetadata.signature,
        clientGatewayMessageId: fileMetadata.clientGatewayMessageId,
        data: fs.createReadStream(fullPath),
      };
    }

    const decryptionStream = await this.keyService
      .decryptMessageStream(
        fullPath,
        fileMetadata.clientGatewayMessageId,
        fileMetadata.did
      )
      .catch((e) => {
        this.logger.error(`decryption stream failed for ${fileId}`, e);

        throw e;
      });

    return {
      fileName: fileId,
      sender: fileMetadata.did,
      signature: fileMetadata.signature,
      clientGatewayMessageId: fileMetadata.clientGatewayMessageId,
      data: decryptionStream,
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

  private async createMetadata(fileId: string): Promise<FileMetadataEntity> {
    const fileMetadata: FileMetadataEntity | null = await this.getFileMetadata(
      fileId
    );

    const path: string = join(this.downloadPath, fileId + this.ext);

    if (fileMetadata) {
      this.logger.debug(`returning file from cache ${fileId}`);

      return fileMetadata;
    }

    this.logger.debug(`${fileId} is not cached attempting to download`);

    const { headers, data } = await this.ddhubFilesService.downloadFile(fileId);

    const writeStream: fs.WriteStream = fs.createWriteStream(path);

    const writeFilePromise = () => {
      data.pipe(writeStream);

      return new Promise((resolve, reject) => {
        writeStream.on('finish', () => {
          resolve(null);
        });

        writeStream.on('error', reject);
      });
    };

    await writeFilePromise();

    const encryptionEnabled: boolean = headers.payloadencryption === 'true';

    return this.fileMetadataWrapper.repository.save({
      clientGatewayMessageId: headers.clientgatewaymessageid,
      signature: headers.signature,
      did: headers.ownerdid,
      fileId,
      encrypted: encryptionEnabled,
    });
  }

  private async getFileMetadata(
    fileId: string
  ): Promise<FileMetadataEntity | null> {
    const fileMetadata: FileMetadataEntity | null =
      await this.fileMetadataWrapper.repository.findOne({
        where: {
          fileId,
        },
      });

    if (fileMetadata) {
      this.logger.debug(`file metadata exists for file ${fileId}`);

      const fullPath = join(this.downloadPath, fileId + this.ext);

      const existsInStorage: boolean = fs.existsSync(fullPath);

      if (!existsInStorage) {
        this.logger.debug(
          `corruption between database and file system for file ${fileId}`
        );

        await this.fileMetadataWrapper.repository.delete({
          fileId,
        });

        return null;
      }
      this.logger.debug(
        `returning file metadata from cache for file ${fileId}`
      );

      return fileMetadata;
    }

    return null;
  }
}
