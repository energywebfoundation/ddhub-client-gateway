import { Injectable, Logger, StreamableFile } from '@nestjs/common';
import { EventsGateway } from '../gateway/events.gateway';
import { ConfigService } from '@nestjs/config';
import { Message } from '../../dsb-client/dsb-client.interface';
import { DsbApiService } from '../../dsb-client/service/dsb-api.service';
import {
  SendMessageDto,
  uploadMessageBodyDto,
} from '../dto/request/send-message.dto';

import { GetMessagesDto } from '../dto/request/get-messages.dto';

import { DownloadMessagesDto } from '../dto/request/download-file.dto';

// import { SecretsEngineService } from '../../secrets-engine/secrets-engine.interface';
import { ChannelService } from '../../channel/service/channel.service';
import { TopicService } from '../../channel/service/topic.service';
import { IdentityService } from '../../identity/service/identity.service';
import { IsSchemaValid } from '../../utils/validator/decorators/IsSchemaValid';
import { TopicNotFoundException } from '../exceptions/topic-not-found.exception';
import { ChannelTypeNotPubException } from '../exceptions/channel-type-not-pub.exception';
import { RecipientsNotFoundException } from '../exceptions/recipients-not-found-exception';
import { MessagesNotFoundException } from '../exceptions/messages-not-found.exception';
import { MessageSignatureNotValidException } from '../exceptions/messages-signature-not-valid.exception';
import {
  SendMessageResponse,
  SearchMessageResponseDto,
} from '../message.interface';
import { ChannelType } from '../../../modules/channel/channel.const';
import { EnrolmentRepository } from '../../storage/repository/enrolment.repository';

import { KeysService } from '../../keys/service/keys.service';

import { VaultService } from '../../secrets-engine/service/vault.service';
import { v4 as uuidv4 } from 'uuid';
import { Blob } from 'buffer';
import * as fs from 'fs';
import { createReadStream } from 'fs';
import { join } from 'path';

export enum EventEmitMode {
  SINGLE = 'SINGLE',
  BULK = 'BULK',
}

@Injectable()
export class MessageService {
  protected readonly logger = new Logger(MessageService.name);

  constructor(
    // protected readonly secretsEngineService: SecretsEngineService,
    protected readonly gateway: EventsGateway,
    protected readonly configService: ConfigService,
    protected readonly dsbApiService: DsbApiService,
    protected readonly channelService: ChannelService,
    protected readonly topicService: TopicService,
    protected readonly identityService: IdentityService,
    protected readonly keyService: KeysService,
    protected readonly enrolmentRepository: EnrolmentRepository,
    protected readonly vaultService: VaultService
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

  public async sendMessage(dto: SendMessageDto): Promise<SendMessageResponse> {
    const channel = await this.channelService.getChannelOrThrow(dto.fqcn);

    const topic = await this.topicService.getTopic(
      dto.topicName,
      dto.topicOwner,
      dto.topicVersion
    );

    console.log('topic', topic);

    // if (!topic) {
    //   throw new TopicNotFoundException('NOT Found');
    // }

    const { qualifiedDids } = await this.channelService.getChannelQualifiedDids(
      dto.fqcn
    );

    if (qualifiedDids.length === 0) {
      throw new RecipientsNotFoundException();
    }

    if (channel.type !== ChannelType.PUB) {
      throw new ChannelTypeNotPubException();
    }

    this.logger.log('Validating schema');
    IsSchemaValid(
      {
        type: 'object',
        properties: {
          data: {
            type: 'number',
          },
        },
      },
      dto.payload
    );

    this.logger.log('generating Client Gateway Message Id');
    const clientGatewayMessageId: string = uuidv4();

    console.log('clientGatewayMessageId', clientGatewayMessageId);

    this.logger.log('Generating Random Key');
    // const randomKey: string = await this.keyService.generateRandomKey();
    const randomKey: string =
      '7479377c81201eb89b90b11dda72bdc89b6473d6d1d60d4dad23c495b22e794d';

    console.log('randomKey', randomKey);

    this.logger.log('Encrypting Payload');

    const encryptedMessage = await this.keyService.encryptMessage(
      JSON.stringify(dto.payload),
      randomKey,
      'utf-8' // put it const file
    );

    this.logger.log('fetching private key');
    const privateKey = await this.vaultService.getPrivateKey();

    this.logger.log('Generating Signature');

    const signature = await this.keyService.createSignature(
      encryptedMessage,
      '0x' + privateKey
    );

    this.logger.log('Sending CipherText as Internal Message');

    await Promise.all(
      qualifiedDids.map(async (recipientDid: string) => {
        const encryptedSymmetricKey =
          'NvRCzjYrhllVmX2EroJlc+10nUdtL+yQU/cpPWZXazImqHntt+O3xk911Oa639o48j5vMUv7ji3MuFAwafX/bYsL0ZNS9Xfgup9hFZqS57tfS2ydKhZkiI/W3wHbWSTmlB2h3mtwF3/Ux+9Ad3HrBToklJAJl2n3yjqwKFwXvYqswsKiR5e4ojcLN04+IEMrgxojEYYEjbCzR1gD9mdaaTEAQJgic7wBDQca3z9cCnN33jGVS0f9+5Csmb0X6KM8SLhlrA0ibxuhMnG4DIgw0mU4fMckTzU7v/dgBLY9d75wWlA97N1OViy8DbB85QFvp/KytIgNzHhlqeNc+OpRPXQPqu7skXclVNbvwElYwVtIsJC6zyYQP0hvXDtudgDf8nswW35HM1fLmSYKg6lam4/goAKyEdCFHug/L8AJLD9ZzOmyfBZtapcZlFOXgXkMG0UioAXWcblwR2mrgxvXK1UB3fUoOlej0zSEVm01qXXjGK9u0E0gRrtdutcWzPdzp4frTtpcY0aecxxCFrk0nc2ouiI4Uz2gDIiOFfB11/ZnKqVtDYVhGVJ/LpvMkXkXOmf+VTNEqJzh50bEg4QR8pnNA7WGjyovwZ6qdAf077WhvMfTkuGDErW4iwMvFJTvbbjdM2lAycjKBkHnsKaH3pIWbWYOSUEzQP0H5E+/W2o=';
        console.log('encryptedSymmetricKey', encryptedSymmetricKey);

        await this.dsbApiService.sendMessageInternal(
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

    return this.dsbApiService.sendMessage(
      qualifiedDids,
      encryptedMessage,
      '62453a51ab8d1b108a880af7',
      '2.0.0',
      signature,
      clientGatewayMessageId,
      dto.transactionId
    );
  }

  public async getMessages({
    topicId,
    clientId,
    amount,
    from,
    senderId,
  }: GetMessagesDto): Promise<any> {
    const encryptedMessageResponse: Array<unknown> = [];

    const messages: SearchMessageResponseDto[] =
      await this.dsbApiService.messagesSearch(
        topicId,
        senderId,
        clientId,
        from,
        1
      );

    if (messages.length === 0) {
      throw new MessagesNotFoundException();
    }

    console.log('messages', messages);

    await Promise.all(
      messages.map(async (message: SearchMessageResponseDto) => {
        if (!message.isFile) {
          const isSignatureValid = await this.keyService.verifySignature(
            message.senderDid,
            message.signature,
            message.payload.replace(/['"]+/g, '')
          );

          this.logger.debug(
            `signature matching result for message with id ${message.messageId}`,
            isSignatureValid
          );

          if (isSignatureValid) {
            const decryptedMessage = await this.keyService.decryptMessage(
              JSON.parse(message.payload),
              message.clientGatewayMessageId,
              message.senderDid
            );

            this.logger.debug(
              `decrypting Message for message with id ${message.messageId}`,
              decryptedMessage
            );

            encryptedMessageResponse.push(decryptedMessage);
          } else {
            this.logger.error(
              `Signature Not Matched for Message Id ${message.messageId}`
            );
            throw new MessageSignatureNotValidException(
              `Signature Not Matched for Message Id ${message.messageId}`
            );
          }
        }
      })
    ).catch((e) => {
      this.logger.error(
        'Error while signature validationn or decrypting message',
        e
      );
      throw new Error(e);
    });

    return encryptedMessageResponse;
  }

  public async uploadMessage(
    file: Express.Multer.File,
    dto: uploadMessageBodyDto
  ): Promise<SendMessageResponse> {
    const channel = await this.channelService.getChannelOrThrow(dto.fqcn);
    const topic = await this.topicService.getTopic(
      dto.topicName,
      dto.topicOwner,
      dto.topicVersion
    );
    const { qualifiedDids } = await this.channelService.getChannelQualifiedDids(
      dto.fqcn
    );

    if (qualifiedDids.length === 0) {
      throw new RecipientsNotFoundException();
    }

    // if (!topic) {
    //   throw new TopicNotFoundException('TOPIC NOT FOUND');
    // }

    if (channel.type !== ChannelType.PUB) {
      throw new ChannelTypeNotPubException();
    }

    this.logger.log('generating Client Gateway Message Id');
    const clientGatewayMessageId: string = uuidv4();

    this.logger.log('Generating Random Key');
    const randomKey: string = await this.keyService.generateRandomKey();

    console.log('randomKey', randomKey);

    this.logger.log('Encrypting Payload');
    const encryptedMessage = await this.keyService.encryptMessage(
      JSON.stringify(file.buffer),
      randomKey,
      'utf-8'
    );

    this.logger.log('fetching private key');
    const privateKey = await this.vaultService.getPrivateKey();

    this.logger.log('Generating Signature');
    const signature = await this.keyService.createSignature(
      encryptedMessage,
      '0x' + privateKey
    );

    console.log('signature', signature);

    this.logger.log(
      'Sending CipherText as Internal Message to all qualified dids'
    );

    await Promise.all(
      qualifiedDids.map(async (recipientDid: string) => {
        const decryptionCiphertext = await this.keyService.encryptSymmetricKey(
          randomKey,
          recipientDid
        );

        console.log('decryptionCiphertext', decryptionCiphertext);

        await this.dsbApiService.sendMessageInternal(
          recipientDid,
          clientGatewayMessageId,
          decryptionCiphertext
        );
      })
    ).catch((e) => {
      this.logger.error(
        'Error while Sending CipherText as Internal Message to recipients',
        e
      );
      throw new Error(e);
    });

    console.log('encryptedMessage', encryptedMessage);

    return this.dsbApiService.uploadFile(
      file,
      qualifiedDids,
      '62453a51ab8d1b108a880af7',
      '2.0.0',
      signature,
      encryptedMessage,
      clientGatewayMessageId,
      dto.transactionId
    );
  }

  public async downloadMessages(fileId: string): Promise<string> {
    const fileResponse = await this.dsbApiService.downloadFile(fileId);

    console.log('fileResponse', fileResponse);

    const isSignatureValid = await this.keyService.verifySignature(
      fileResponse.headers.ownerdid,
      fileResponse.headers.signature,
      fileResponse.data
    );

    console.log('isSignatureValid', isSignatureValid);

    if (!isSignatureValid) {
      this.logger.error(`Signature Not Matched for File Id ${fileId}`);
      throw new MessageSignatureNotValidException(
        `Signature Not Matched for File Id ${fileId}`
      );
    } else {
      const decryptedMessage = await this.keyService.decryptMessage(
        fileResponse.data,
        fileResponse.headers.clientgatewaymessageid,
        fileResponse.headers.ownerdid
      );

      this.logger.debug(
        `decrypting Message for File Id  ${fileId}`,
        decryptedMessage
      );

      console.log('decryptedMessage', decryptedMessage.toString());

      await fs.writeFileSync(
        __dirname + '/../../../test.csv', // take the file name from api response
        decryptedMessage.toString()
      );
    }

    return join(__dirname + '/../../../test.csv');
  }
}
