import { Injectable, Logger } from '@nestjs/common';
import { EventsGateway } from '../gateway/events.gateway';
import { ConfigService } from '@nestjs/config';
import {
  SendMessageDto,
  uploadMessageBodyDto,
} from '../dto/request/send-message.dto';
import { GetMessagesDto } from '../dto/request/get-messages.dto';
import { ChannelService } from '../../channel/service/channel.service';
import { TopicService } from '../../channel/service/topic.service';
import { IsSchemaValid } from '../../utils/validator/decorators/IsSchemaValid';
import { TopicNotFoundException } from '../exceptions/topic-not-found.exception';
import { ChannelTypeNotPubException } from '../exceptions/channel-type-not-pub.exception';
import { RecipientsNotFoundException } from '../exceptions/recipients-not-found-exception';
import { MessageSignatureNotValidException } from '../exceptions/messages-signature-not-valid.exception';
import { TopicOwnerTopicNameRequiredException } from '../exceptions/topic-owner-and-topic-name-required.exception';
import { MessageDecryptionFailedException } from '../exceptions/message-decryption-failed.exception';
import { FileSizeException } from '../exceptions/file-size.exception';
import { FIleTypeNotSupportedException } from '../exceptions/file-type-not-supported.exception';
import { NoPrivateKeyException } from '../../storage/exceptions/no-private-key.exception';
import {
  DownloadMessageResponse,
  GetMessageResponse,
  SearchMessageResponseDto,
  SendMessageResponse,
} from '../message.interface';
import { ChannelType } from '../../../modules/channel/channel.const';
import { KeysService } from '../../keys/service/keys.service';
import { v4 as uuidv4 } from 'uuid';
import { EncryptedMessageType } from '../../message/message.const';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import {
  ChannelEntity,
  TopicEntity,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { FileNotFoundException } from '../exceptions/file-not-found.exception';
import {
  DdhubFilesService,
  DdhubMessagesService,
  Message,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { TopicNotRelatedToChannelException } from '../exceptions/topic-not-related-to-channel.exception';

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
    protected readonly configService: ConfigService,
    protected readonly channelService: ChannelService,
    protected readonly topicService: TopicService,
    protected readonly keyService: KeysService,
    protected readonly ddhubMessageService: DdhubMessagesService,
    protected readonly ddhubFilesService: DdhubFilesService
  ) {}

  public async sendMessagesToSubscribers(
    messages: Message[],
    fqcn: string
  ): Promise<void> {
    const emitMode: EventEmitMode = this.configService.get(
      'EVENTS_EMIT_MODE',
      EventEmitMode.BULK
    );

    if (emitMode === EventEmitMode.BULK) {
      this.broadcast(messages.map((message) => ({ ...message, fqcn })));

      return;
    }

    messages.forEach((message: Message) => {
      this.broadcast({ ...message, fqcn });
    });
  }

  private broadcast(data): void {
    this.gateway.server.clients.forEach((client) => {
      client.send(JSON.stringify(data));
    });
  }

  private checkTopicForChannel(
    channel: ChannelEntity,
    topic: TopicEntity
  ): boolean {
    return !channel.conditions.topics.find(
      (topicOfChannel) => topicOfChannel.topicId === topic.id
    );
  }

  public async sendMessage(dto: SendMessageDto): Promise<SendMessageResponse> {
    const channel: ChannelEntity = await this.channelService.getChannelOrThrow(
      dto.fqcn
    );

    const topic: TopicEntity = await this.topicService.getTopic(
      dto.topicName,
      dto.topicOwner,
      dto.topicVersion
    );

    if (
      !topic ||
      !topic.id ||
      !topic.schema ||
      !topic.schemaType ||
      !topic.version
    ) {
      throw new TopicNotFoundException('NOT Found');
    }

    const isTopicNotRelatedToChannel: boolean = this.checkTopicForChannel(
      channel,
      topic
    );

    if (isTopicNotRelatedToChannel) {
      throw new TopicNotRelatedToChannelException(
        `topic with ${topic.name} and owner ${topic.owner} not related to channel with name ${dto.fqcn}`
      );
    }

    const qualifiedDids = channel.conditions.qualifiedDids;
    if (qualifiedDids.length === 0) {
      throw new RecipientsNotFoundException();
    }

    if (channel.type !== ChannelType.PUB) {
      throw new ChannelTypeNotPubException();
    }

    this.logger.log('Validating schema');
    IsSchemaValid(topic.schemaType, topic.schema, dto.payload);

    this.logger.log('generating Client Gateway Message Id');
    const clientGatewayMessageId: string = uuidv4();

    this.logger.log('Generating Random Key');
    const randomKey: string = this.keyService.generateRandomKey();

    this.logger.log('Encrypting Payload');

    const encryptedMessage = this.keyService.encryptMessage(
      dto.payload,
      randomKey,
      EncryptedMessageType['UTF-8']
    );

    this.logger.log('fetching private key');
    const privateKey = await this.secretsEngineService.getPrivateKey();

    if (!privateKey) {
      throw new NoPrivateKeyException();
    }

    this.logger.log('Generating Signature');

    const signature = this.keyService.createSignature(
      encryptedMessage,
      '0x' + privateKey
    );

    this.logger.log('Sending CipherText as Internal Message');

    await Promise.allSettled(
      qualifiedDids.map(async (recipientDid: string) => {
        const encryptedSymmetricKey = await this.keyService.encryptSymmetricKey(
          randomKey,
          recipientDid
        );
        await this.ddhubMessageService.sendMessageInternal(
          recipientDid,
          clientGatewayMessageId,
          encryptedSymmetricKey
        );
      })
    ).catch((e) => {
      this.logger.error(
        'Error while Sending CipherText as Internal Message to recipients',
        e
      );
      throw new Error(e);
    });

    this.logger.log('Sending Message');

    return this.ddhubMessageService.sendMessage(
      qualifiedDids,
      encryptedMessage,
      topic.id,
      topic.version,
      signature,
      clientGatewayMessageId,
      dto.transactionId
    );
  }

  public async getMessages({
    fqcn,
    from,
    amount,
    topicName,
    topicOwner,
    clientId,
  }: GetMessagesDto): Promise<GetMessageResponse[]> {
    const getMessagesResponse: Array<GetMessageResponse> = [];

    const channel: ChannelEntity = await this.channelService.getChannelOrThrow(
      fqcn
    );

    // topic owner and topic name should be present
    if ((topicOwner && !topicName) || (!topicOwner && topicName)) {
      throw new TopicOwnerTopicNameRequiredException('');
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

    // call message search
    const messages: Array<SearchMessageResponseDto> =
      await this.ddhubMessageService.messagesSearch(
        topicIds,
        channel.conditions.qualifiedDids,
        clientId,
        from,
        amount
      );

    //no messages then return empty array
    if (messages.length === 0) {
      return [];
    }

    //validate signature and decrypt messages
    await Promise.allSettled(
      messages.map(async (message: SearchMessageResponseDto) => {
        const topicFromCache: TopicEntity =
          await this.topicService.getTopicById(message.topicId);

        const result: GetMessageResponse = {
          id: message.messageId,
          topicName: topicFromCache.name,
          topicOwner: topicFromCache.owner,
          topicVersion: message.topicVersion,
          payload: message.payload,
          signature: message.signature,
          sender: message.senderDid,
          timestampNanos: message.timestampNanos,
          transactionId: message.transactionId,
          signatureValid: false,
          decryption: { status: true },
        };

        if (!message.isFile) {
          //signature validation
          const isSignatureValid = await this.keyService.verifySignature(
            message.senderDid,
            message.signature,
            message.payload
          );

          this.logger.debug(
            `signature matching result for message with id ${message.messageId}`,
            isSignatureValid
          );

          if (isSignatureValid) {
            result.signatureValid = true;

            try {
              const decryptedMessage = await this.keyService.decryptMessage(
                message.payload,
                message.clientGatewayMessageId,
                message.senderDid
              );

              if (!decryptedMessage) {
                result.decryption.status = false;
                result.decryption.errorMessage = 'Decryption failed.';
                result.payload = '';
              } else {
                result.payload = decryptedMessage;
              }

              this.logger.debug(
                `decrypting Message for message with id ${message.messageId}`
              );
            } catch (error) {
              result.decryption.status = false;
              result.decryption.errorMessage = JSON.stringify(error);
            }
          }
        }

        getMessagesResponse.push(result);
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
      throw new FIleTypeNotSupportedException('');
    }

    if (file.size > this.configService.get('MAX_FILE_SIZE')) {
      throw new FileSizeException('');
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

    //Check if topic exists

    if (
      !topic ||
      !topic.id ||
      !topic.schema ||
      !topic.schemaType ||
      !topic.version
    ) {
      throw new TopicNotFoundException('NOT Found');
    }

    //System gets internal channel details
    const qualifiedDids = channel.conditions.qualifiedDids;

    // return error if no recipients
    if (qualifiedDids.length === 0) {
      throw new RecipientsNotFoundException();
    }

    if (channel.type !== ChannelType.UPLOAD) {
      throw new ChannelTypeNotPubException();
    }

    this.logger.log('generating Client Gateway Message Id');
    const clientGatewayMessageId: string = uuidv4();

    this.logger.log('Generating Random Key');
    const randomKey: string = this.keyService.generateRandomKey();

    this.logger.log('Encrypting Payload');
    const encryptedMessage = this.keyService.encryptMessage(
      JSON.stringify(file.buffer),
      randomKey,
      EncryptedMessageType['UTF-8']
    );

    this.logger.log('fetching private key');
    const privateKey = await this.secretsEngineService.getPrivateKey();

    if (!privateKey) {
      throw new NoPrivateKeyException();
    }

    this.logger.log('Generating Signature');
    const signature = this.keyService.createSignature(
      encryptedMessage,
      '0x' + privateKey
    );

    this.logger.log(
      'Sending CipherText as Internal Message to all qualified dids'
    );

    await Promise.allSettled(
      qualifiedDids.map(async (recipientDid: string) => {
        this.logger.debug(
          `generating encrypted symmetric key for recipientId: ${recipientDid} `
        );
        const decryptionCiphertext = await this.keyService.encryptSymmetricKey(
          randomKey,
          recipientDid
        );

        this.logger.debug(
          `sending encrypted symmetric key for recipientId: ${recipientDid} `
        );
        await this.ddhubMessageService.sendMessageInternal(
          recipientDid,
          clientGatewayMessageId,
          decryptionCiphertext
        );
      })
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
      throw new FileNotFoundException('');
    }

    fileName = fileName.replace(/"/g, '');

    //Verifying signature
    const isSignatureValid: boolean = await this.keyService.verifySignature(
      fileResponse.headers.ownerdid,
      fileResponse.headers.signature,
      fileResponse.data
    );

    // Return error that signature is invalid
    if (!isSignatureValid) {
      this.logger.error(`Signature not matched for file id: ${fileId}`);
      throw new MessageSignatureNotValidException(
        `Signature not matched for file id: ${fileId}`
      );
    } else {
      let decryptedMessage: string;

      try {
        // Decrypting File Content
        this.logger.debug(`decrypting Message for File Id  ${fileId}`);

        decryptedMessage = await this.keyService.decryptMessage(
          fileResponse.data,
          fileResponse.headers.clientgatewaymessageid,
          fileResponse.headers.ownerdid
        );

        this.logger.debug(`Completed decryption for file id:${fileId}`);
      } catch (e) {
        this.logger.debug(`Decryption failed for file id:${fileId}`);
        throw new MessageDecryptionFailedException(JSON.stringify(e));
      }

      if (!decryptedMessage) {
        throw new MessageDecryptionFailedException('');
      }

      try {
        // Parsing Decrypted data
        decrypted = JSON.parse(decryptedMessage);
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
}
