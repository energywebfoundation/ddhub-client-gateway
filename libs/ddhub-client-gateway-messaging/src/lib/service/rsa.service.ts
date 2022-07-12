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
  SendMessageResponseFile,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import Crypto from 'crypto';
import {
  NoPrivateKeyException,
  SecretsEngineService,
} from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import {
  FileMetadataEntity,
  FileMetadataWrapperRepository,
  TopicEntity,
  TopicRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import {
  GetMessageResponse,
  SearchMessageResponseDto,
} from '../../../../../apps/dsb-client-gateway-api/src/app/modules/message/message.interface';
import { EncryptionStatus } from '../../../../../apps/dsb-client-gateway-api/src/app/modules/message/message.const';
import { join } from 'path';
import fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { MessageSignatureNotValidException } from '../../../../../apps/dsb-client-gateway-api/src/app/modules/message/exceptions/messages-signature-not-valid.exception';

@Injectable()
export class RsaService extends MessageService {
  protected readonly uploadPath: string;
  protected readonly downloadPath: string;
  protected readonly ext: string = '.enc';

  constructor(
    protected readonly rsaEncryptionService: RsaEncryptionService,
    protected readonly ddhubMessageService: DdhubMessagesService,
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly topicWrapper: TopicRepositoryWrapper,
    protected readonly configService: ConfigService,
    protected readonly ddhubFilesService: DdhubFilesService,
    protected readonly fileMetadataWrapper: FileMetadataWrapperRepository
  ) {
    super();

    this.uploadPath = configService.get<string>('UPLOAD_FILES_DIR');
    this.downloadPath = configService.get<string>('DOWNLOAD_FILES_DIR');
  }

  public async downloadMessages({ fileId }: DownloadMessage): Promise<any> {
    const fileMetadata: FileMetadataEntity = await this.createMetadata(fileId);

    const fullPath: string = join(this.downloadPath, fileId + this.ext);

    const isSignatureValid: boolean =
      await this.rsaEncryptionService.verifySignature(
        fileMetadata.did,
        fileMetadata.signature,
        await this.rsaEncryptionService.checksumFile(fullPath)
      );

    if (!isSignatureValid) {
      throw new MessageSignatureNotValidException(
        fileId,
        fileMetadata.signature
      );
    }

    if (!fileMetadata.encrypted) {
      return {
        fileName: fileId,
        sender: fileMetadata.did,
        signature: fileMetadata.signature,
        clientGatewayMessageId: fileMetadata.clientGatewayMessageId,
        data: fs.createReadStream(fullPath),
      };
    }

    const decryptionStream = await this.rsaEncryptionService
      .decryptMessageStream(
        fullPath,
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
  }: SendMessage): Promise<any> {
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

    await this.sendSymmetricKeys(
      logger,
      channel.conditions.qualifiedDids,
      randomKey,
      clientGatewayMessageId
    );

    logger.log('preparing message');

    const message: string = channel.payloadEncryption
      ? this.rsaEncryptionService.encryptMessage(payload, randomKey)
      : payload;

    logger.log('creating signature');

    const signature: string = this.rsaEncryptionService.createSignature(
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
  }: UploadMessage): Promise<any> {
    const logger = new Logger(RsaService.name + '_' + clientGatewayMessageId);

    const randomKey: string = Crypto.randomBytes(32).toString('hex');

    const filePath: string = await this.prepareFile(
      channel.payloadEncryption,
      file,
      randomKey,
      clientGatewayMessageId
    );

    const privateKey = await this.secretsEngineService.getPrivateKey();
    const checksum = await this.rsaEncryptionService.checksumFile(filePath);

    const signature = this.rsaEncryptionService.createSignature(
      checksum,
      '0x' + privateKey
    );

    await this.sendSymmetricKeys(
      logger,
      channel.conditions.qualifiedDids,
      randomKey,
      clientGatewayMessageId
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

  private async createMetadata(fileId: string): Promise<FileMetadataEntity> {
    const fileMetadata: FileMetadataEntity | null = await this.getFileMetadata(
      fileId
    );

    const path: string = join(this.downloadPath, fileId + this.ext);

    if (fileMetadata) {
      return fileMetadata;
    }

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
      const fullPath = join(this.downloadPath, fileId + this.ext);

      const existsInStorage: boolean = fs.existsSync(fullPath);

      if (!existsInStorage) {
        await this.fileMetadataWrapper.repository.delete({
          fileId,
        });

        return null;
      }

      return fileMetadata;
    }

    return null;
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
      filePath = join(this.uploadPath, clientGatewayMessageId + this.ext);

      const stream = fs.createWriteStream(filePath);

      const writeStream = file.stream.pipe(stream);

      const promise = () =>
        new Promise((resolve) => {
          writeStream.on('finish', () => resolve(null));
        });

      await promise();
    }

    return filePath;
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
        const encryptedSymmetricKey =
          await this.rsaEncryptionService.encryptSymmetricKey(
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
      await this.rsaEncryptionService.verifySignature(
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
}
