import { Injectable, Logger } from '@nestjs/common';
import { MessageService } from './message.service';
import {
  DownloadMessage,
  GetMessages,
  SendMessage,
  UploadMessage,
} from '../message.interface';
import { RsaEncryptionService as RsaEncryptionService } from '@dsb-client-gateway/ddhub-client-gateway-encryption';
import { Span } from 'nestjs-otel';
import {
  DdhubFilesService,
  DdhubMessagesService,
  DownloadMessageResponse,
  SendMessageResponse,
  SendMessageResponseFile,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import Crypto from 'crypto';
import {
  NoPrivateKeyException,
  SecretsEngineService,
} from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import {
  FileMetadataEntity,
  TopicEntity,
  TopicRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import {
  GetMessageResponse,
  SearchMessageResponseDto,
} from '../../../../../apps/dsb-client-gateway-api/src/app/modules/message/message.interface';
import { EncryptionStatus } from '../../../../../apps/dsb-client-gateway-api/src/app/modules/message/message.const';
import fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { FileHelperService } from './file-helper.service';
import { SignatureService } from './signature.service';
import { SymmetricKeysService } from './symmetric-keys.service';

@Injectable()
export class RsaService extends MessageService {
  constructor(
    protected readonly rsaEncryptionService: RsaEncryptionService,
    protected readonly ddhubMessageService: DdhubMessagesService,
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly topicWrapper: TopicRepositoryWrapper,
    protected readonly configService: ConfigService,
    protected readonly ddhubFilesService: DdhubFilesService,
    protected readonly fileHelperService: FileHelperService,
    protected readonly signatureService: SignatureService,
    protected readonly symmetricKeysService: SymmetricKeysService
  ) {
    super(signatureService);
  }

  public async downloadMessages({
    fileId,
  }: DownloadMessage): Promise<DownloadMessageResponse> {
    const fileMetadata: FileMetadataEntity =
      await this.fileHelperService.createMetadata(fileId);

    await this.fileHelperService.validateFileSignature(fileMetadata);

    if (!fileMetadata.encrypted) {
      return {
        fileName: fileId,
        sender: fileMetadata.did,
        signature: fileMetadata.signature,
        clientGatewayMessageId: fileMetadata.clientGatewayMessageId,
        data: fs.createReadStream(fileMetadata.path),
      };
    }

    const decryptionStream = await this.rsaEncryptionService
      .decryptMessageStream(
        fileMetadata.path,
        fileMetadata.clientGatewayMessageId,
        fileMetadata.did
      )
      .catch((e) => {
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

  public async getMessages(query: GetMessages): Promise<any> {
    const messagesToReturn = [];

    await Promise.allSettled(
      query.messages.map(async (message: SearchMessageResponseDto) => {
        const topic: TopicEntity | null =
          await this.topicWrapper.topicRepository.findOne({
            where: {
              id: message.topicId,
            },
          });

        if (!topic) {
          throw new Error(`topic with id ${message.topicId} not found`);
        }

        const processedMessage = await this.processMessage(
          query.channel.payloadEncryption,
          topic,
          message
        );

        messagesToReturn.push(processedMessage);
      })
    );

    return messagesToReturn;
  }

  public async sendMessage({
    topic,
    transactionId,
    payload,
    channel,
    clientGatewayMessageId,
  }: SendMessage): Promise<SendMessageResponse> {
    const logger = new Logger(RsaService.name + '_' + clientGatewayMessageId);

    const randomKey: string = Crypto.randomBytes(32).toString('hex');

    const privateKey: string | null =
      await this.secretsEngineService.getPrivateKey();

    if (!privateKey) {
      logger.error('no private key is set');

      throw new NoPrivateKeyException();
    }

    logger.log(
      'sending random key to qualified dids',
      channel.conditions.qualifiedDids
    );

    await this.symmetricKeysService.send(
      channel.conditions.qualifiedDids,
      randomKey,
      clientGatewayMessageId,
      logger
    );

    logger.log('preparing message');

    const message: string = channel.payloadEncryption
      ? this.rsaEncryptionService.encryptMessage(payload, randomKey)
      : payload;

    logger.log('creating signature');

    const signature: string = this.signatureService.createSignature(
      message,
      '0x' + privateKey
    );

    return this.ddhubMessageService.sendMessage(
      channel.conditions.qualifiedDids,
      message,
      topic.id,
      topic.version,
      signature,
      clientGatewayMessageId,
      channel.payloadEncryption,
      transactionId
    );
  }

  public async uploadMessage({
    file,
    topic,
    transactionId,
    channel,
    clientGatewayMessageId,
  }: UploadMessage): Promise<SendMessageResponseFile> {
    const logger = new Logger(RsaService.name + '_' + clientGatewayMessageId);

    const randomKey: string = Crypto.randomBytes(32).toString('hex');

    const filePath: string = await this.prepareFile(
      channel.payloadEncryption,
      file,
      randomKey,
      clientGatewayMessageId
    );

    const privateKey = await this.secretsEngineService.getPrivateKey();
    const checksum = await this.signatureService.checksumFile(filePath);

    const signature = this.signatureService.createSignature(
      checksum,
      '0x' + privateKey
    );

    await this.symmetricKeysService.send(
      channel.conditions.qualifiedDids,
      randomKey,
      clientGatewayMessageId,
      logger
    );

    const result: SendMessageResponseFile =
      await this.ddhubFilesService.uploadFile(
        fs.createReadStream(filePath),
        file.originalname,
        channel.conditions.qualifiedDids,
        topic.id,
        topic.version,
        signature,
        clientGatewayMessageId,
        channel.payloadEncryption,
        transactionId
      );

    try {
      fs.unlinkSync(filePath);
      fs.unlinkSync(file.path);
    } catch (e) {
      logger.error('file unlink failed', e);
    }

    return result;
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

    const isSignatureValid: boolean =
      await this.signatureService.verifySignature(
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
      await this.rsaEncryptionService.decryptMessage(
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

  protected async prepareFile(
    payloadEncryption: boolean,
    file: Express.Multer.File,
    randomKey: string,
    clientGatewayMessageId: string
  ): Promise<string> {
    let filePath: string;

    if (payloadEncryption) {
      filePath = await this.rsaEncryptionService.encryptMessageStream(
        file.stream,
        randomKey,
        clientGatewayMessageId
      );
    } else {
      filePath = await this.fileHelperService.storeNotEncryptedFileForUpload(
        clientGatewayMessageId,
        file
      );
    }

    return filePath;
  }
}
