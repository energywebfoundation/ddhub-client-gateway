import { Injectable, Logger } from '@nestjs/common';
import { GetMessagesDto } from '../dto/request/get-messages.dto';
import {
  AddressBookRepositoryWrapper,
  DidEntity,
  ReceivedMessageEntity,
  ReceivedMessageReadStatusEntity,
  ReceivedMessageReadStatusRepositoryWrapper,
  ReceivedMessageRepositoryWrapper,
  SentMessageEntity,
  SentMessageRecipientRepositoryWrapper,
  SentMessageRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { EncryptionStatus } from '../message.const';
import { KeysService } from '../../keys/service/keys.service';
import { GetSentMessagesRequestDto } from '../dto/request/get-sent-messages-request.dto';
import { GetSentMessageResponseDto } from '../dto/response/get-sent-message-response.dto';
import { GetReceivedMessageResponseDto } from '../dto/response/get-received-message-response.dto';
import { SchemaType } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';

@Injectable()
export class OfflineMessagesService {
  protected readonly logger = new Logger(OfflineMessagesService.name);

  constructor(
    protected readonly receivedMessageRepositoryWrapper: ReceivedMessageRepositoryWrapper,
    protected readonly sentMessagesRepositoryWrapper: SentMessageRepositoryWrapper,
    protected readonly sentMessagesRecipientsWrapper: SentMessageRecipientRepositoryWrapper,
    protected readonly receivedMessageReadStatusRepositoryWrapper: ReceivedMessageReadStatusRepositoryWrapper,
    protected readonly addressBookRepositoryWrapper: AddressBookRepositoryWrapper,
    protected readonly keysService: KeysService,
    protected readonly iamService: IamService
  ) {}

  public async getOfflineUploadedFile(
    clientGatewayMessageId: string
  ): Promise<SentMessageEntity | null> {
    return this.sentMessagesRepositoryWrapper.repository.findOne({
      where: {
        clientGatewayMessageId,
        isFile: true,
      },
    });
  }

  public async getOfflineSentMessages(
    filterParams: GetSentMessagesRequestDto
  ): Promise<GetSentMessageResponseDto[]> {
    this.logger.debug(
      `getOfflineSentMessagesParams: ${JSON.stringify(filterParams)}`
    );

    const addressBook =
      await this.addressBookRepositoryWrapper.repository.find();

    const buildSentMessageResponse = async (entity: SentMessageEntity) => {
      const relatedMessagesQb = this.receivedMessageRepositoryWrapper.repository
        .createQueryBuilder('rm')
        .where('rm.initiatingMessageId = ANY((:messageIds)::text[])', {
          messageIds: entity.messageIds,
        });

      if (entity.transactionId) {
        relatedMessagesQb.andWhere(
          'rm.initiatingTransactionId = :transactionId',
          {
            transactionId: entity.transactionId,
          }
        );
      }

      const relatedMessagesCount = await relatedMessagesQb.getCount();

      const recipients =
        await this.sentMessagesRecipientsWrapper.repository.find({
          where: {
            clientGatewayMessageId: entity.clientGatewayMessageId,
          },
        });

      return {
        recipients: recipients.map((recipient) => {
          return {
            messageId: recipient.messageId,
            did: recipient.recipientDid,
            alias: addressBook.find(
              (item) => item.did === recipient.recipientDid
            )?.name,
            failed: +recipient.statusCode !== 200,
          };
        }),
        topicOwner: entity.topicOwner,
        topicName: entity.topicName,
        messagesIds: entity.messageIds,
        clientGatewayMessageId: entity.clientGatewayMessageId,
        initiatingMessageId: entity.initiatingMessageId,
        fqcn: entity.fqcn,
        initiatingTransactionId: entity.initiatingTransactionId,
        payload: entity.payload,
        createdDate: entity.createdDate,
        isFile: entity.isFile,
        payloadEncryption: entity.payloadEncryption,
        relatedMessagesCount: relatedMessagesCount,
        senderDid: entity.senderDid,
        signature: entity.signature,
        topicId: entity.topicId,
        timestampNanos: entity.timestampNanos.getTime() * (1000 * 1000),
        timestampISO: entity.timestampNanos.toISOString(),
        topicVersion: entity.topicVersion,
        totalSent: +entity.totalSent,
        totalFailed: +entity.totalFailed,
        transactionId: entity.transactionId,
        totalRecipients: +entity.totalRecipients,
        updatedDate: entity.updatedDate,
      };
    };

    const queryBuilder =
      this.sentMessagesRepositoryWrapper.repository.createQueryBuilder(
        'sent_messages'
      );

    if (filterParams.clientGatewayMessageId) {
      queryBuilder.where('sent_messages.clientGatewayMessageId = :id', {
        id: filterParams.clientGatewayMessageId,
      });
      return await queryBuilder
        .getOne()
        .then(buildSentMessageResponse)
        .then((response) => [response]);
    }

    if (
      filterParams.fqcn &&
      !(
        filterParams.messageId ||
        filterParams.transactionId ||
        filterParams.initiatingMessageId ||
        filterParams.initiatingTransactionId
      )
    ) {
      queryBuilder.andWhere('sent_messages.fqcn = :fqcn', {
        fqcn: filterParams.fqcn,
      });
    }

    if (filterParams.transactionId) {
      queryBuilder.andWhere(
        'sent_messages.initiatingTransactionId = :transactionId',
        {
          transactionId: filterParams.transactionId,
        }
      );
    }

    if (filterParams.messageId) {
      queryBuilder.andWhere(
        'sent_messages.initiatingMessageId = :initiatingMessageId',
        {
          initiatingMessageId: filterParams.messageId,
        }
      );
    }

    if (filterParams.initiatingMessageId) {
      queryBuilder.andWhere(
        ':messageId = ANY(sent_messages."messageIds"::text[])',
        {
          messageId: filterParams.initiatingMessageId,
        }
      );
    }

    if (filterParams.initiatingTransactionId) {
      queryBuilder.andWhere('sent_messages.transactionId = :transactionId', {
        transactionId: filterParams.initiatingTransactionId,
      });
    }

    if (filterParams.topicName) {
      queryBuilder.andWhere('sent_messages.topicName = :topicName', {
        topicName: filterParams.topicName,
      });
    }

    if (filterParams.topicOwner) {
      queryBuilder.andWhere('sent_messages.topicOwner = :topicOwner', {
        topicOwner: filterParams.topicOwner,
      });
    }

    queryBuilder.orderBy(`sent_messages.timestampNanos`, 'DESC');

    const page = filterParams.page || 1;
    const limit = filterParams.limit || 5;

    const skip = (page - 1) * limit;

    queryBuilder.take(limit).skip(skip);

    return queryBuilder.getMany().then(async (entities) => {
      return await Promise.all(entities.map(buildSentMessageResponse));
    });
  }

  public async getOfflineReceivedMessages(
    dto: Partial<GetMessagesDto>
  ): Promise<GetReceivedMessageResponseDto[]> {
    this.logger.debug(
      `getOfflineReceivedMessagesParams: ${JSON.stringify(dto)}`
    );

    const {
      initiatingTransactionId,
      initiatingMessageId,
      fqcn,
      amount,
      topicName,
      topicOwner,
      messageId,
      messageIds,
      transactionId,
    } = dto;

    const rm = 'rm';
    const query = this.receivedMessageRepositoryWrapper.repository
      .createQueryBuilder(rm)
      .where((qb) => {
        if (
          fqcn &&
          !(
            initiatingMessageId ||
            initiatingTransactionId ||
            messageIds ||
            transactionId
          )
        ) {
          qb.andWhere(`${rm}.fqcn = :fqcn`, { fqcn });
        }

        if (topicOwner) {
          qb.andWhere(`${rm}.topicOwner = :topicOwner`, { topicOwner });
        }

        if (topicName) {
          qb.andWhere(`${rm}.topicName = :topicName`, { topicName });
        }

        if (initiatingMessageId) {
          qb.andWhere(`${rm}.messageId = :initiatingMessageId`, {
            initiatingMessageId,
          });
        }

        if (messageIds) {
          qb.andWhere(
            `${rm}.initiatingMessageId = ANY((:messageIds)::text[])`,
            {
              messageIds: messageIds.split(',') || [],
            }
          );
        }

        if (initiatingTransactionId) {
          qb.andWhere(`${rm}.transactionId = :initiatingTransactionId`, {
            initiatingTransactionId,
          });
        }

        if (transactionId) {
          qb.andWhere(`${rm}.initiatingTransactionId = :transactionId`, {
            transactionId,
          });
        }

        if (messageId) {
          qb.andWhere(`${rm}.messageId = :messageId`, { messageId });
        }
      })
      .orderBy(`${rm}.timestampNanos`, 'DESC')
      .take(amount || 3);

    const messages: ReceivedMessageEntity[] = await query.getMany();

    const uniqueSenderDids: string[] = [
      ...new Set(messages.map(({ senderDid }) => senderDid)),
    ];
    const prefetchedSignatureKeys: Record<string, DidEntity | null> =
      await this.keysService.prefetchSignatureKeys(uniqueSenderDids);

    const addressBook =
      await this.addressBookRepositoryWrapper.repository.find();

    return await Promise.all(
      messages.map(async (message: ReceivedMessageEntity) => {
        const isSignatureValid: boolean =
          await this.keysService.verifySignature(
            message.senderDid,
            message.signature,
            message.payload,
            prefetchedSignatureKeys[message.senderDid]
          );

        const isRead: boolean =
          !!(await this.receivedMessageReadStatusRepositoryWrapper.repository
            .createQueryBuilder('rms')
            .where('rms.messageId = :messageId', {
              messageId: message.messageId,
            })
            .getOne());

        const replyMessagesCount =
          await this.sentMessagesRepositoryWrapper.repository
            .query(
              `
              SELECT COUNT(DISTINCT m."clientGatewayMessageId")
              FROM public.sent_messages m
              WHERE m."initiatingMessageId" = $1
              OR (m."initiatingTransactionId" = $2 AND $2 IS NOT NULL AND $2 != '');`,
              [message.messageId, message.transactionId]
            )
            .then((result) => +result[0].count);

        const relatedMessages =
          await this.receivedMessageRepositoryWrapper.repository
            .createQueryBuilder('m')
            .where(
              'm.initiatingMessageId = :initiatingMessageId OR m.initiatingTransactionId = :initiatingTransactionId',
              {
                initiatingMessageId: message.initiatingMessageId,
                initiatingTransactionId: message.initiatingTransactionId,
              }
            )
            .andWhere('m.messageId != :messageId', {
              messageId: message.messageId,
            })
            .getMany();

        return {
          topicOwner: message.topicOwner,
          topicName: message.topicName,
          topicVersion: message.topicVersion,
          replyMessagesCount: replyMessagesCount,
          clientGatewayMessageId: message.clientGatewayMessageId,
          sender: message.senderDid,
          senderAlias: addressBook.find(
            (item) => item.did === message.senderDid
          )?.name,
          signature: message.signature,
          relatedMessagesCount: relatedMessages.length,
          initiatingMessageId: message.initiatingMessageId,
          payloadEncryption: message.payloadEncryption,
          decryption: {
            status: EncryptionStatus.NOT_REQUIRED,
            errorMessage: undefined,
          },
          initiatingTransactionId: message.initiatingTransactionId,
          transactionId: message.transactionId,
          payload: message.payload,
          timestampNanos: message.timestampNanos.getTime() * (1000 * 1000),
          timestampISO: message.timestampNanos.toISOString(),
          id: message.messageId,
          topicId: message.topicId,
          topicSchemaType: SchemaType.JSD7,
          signatureValid: isSignatureValid
            ? EncryptionStatus.SUCCESS
            : EncryptionStatus.FAILED,
          isRead,
        };
      })
    );
  }

  public async ackMessages(
    username: string | null,
    messagesIds: string[]
  ): Promise<void> {
    const recipientUser = username ?? this.iamService.getDIDAddress();
    const messageReadEntities = messagesIds.map((messageId: string) => {
      const entity = new ReceivedMessageReadStatusEntity();
      entity.messageId = messageId;
      entity.recipientUser = recipientUser;
      return entity;
    });
    const alreadyAckedMessages =
      await this.receivedMessageReadStatusRepositoryWrapper.repository.findByIds(
        messageReadEntities
      );

    const messagesToAck = messageReadEntities.filter(
      (entity: ReceivedMessageReadStatusEntity) =>
        !alreadyAckedMessages.find(
          (alreadyAckedMessage) =>
            alreadyAckedMessage.messageId === entity.messageId
        )
    );
    if (!messagesToAck.length) {
      return;
    }

    await this.receivedMessageReadStatusRepositoryWrapper.repository.save(
      messagesToAck
    );
  }
}
