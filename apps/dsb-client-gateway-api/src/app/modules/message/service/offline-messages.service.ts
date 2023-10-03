import { Injectable, Logger } from '@nestjs/common';
import { GetMessagesDto } from '../dto/request/get-messages.dto';
import { GetMessageResponse } from '../message.interface';
import {
  DidEntity,
  ReceivedMessageEntity,
  ReceivedMessageReadStatusRepositoryWrapper,
  ReceivedMessageRepositoryWrapper,
  SentMessageEntity,
  SentMessageRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import moment from 'moment';
import { EncryptionStatus } from '../message.const';
import { KeysService } from '../../keys/service/keys.service';
import { GetSentMessagesRequestDto } from '../dto/request/get-sent-messages-request.dto';
import { GetSentMessageResponseDto } from '../dto/response/get-sent-message-response.dto';
import { In } from 'typeorm';

@Injectable()
export class OfflineMessagesService {
  protected readonly logger = new Logger(OfflineMessagesService.name);

  constructor(
    protected readonly receivedMessageRepositoryWrapper: ReceivedMessageRepositoryWrapper,
    protected readonly sentMessagesRepositoryWrapper: SentMessageRepositoryWrapper,
    protected readonly receivedMessageReadStatusRepositoryWrapper: ReceivedMessageReadStatusRepositoryWrapper,
    protected readonly keysService: KeysService
  ) {}

  public async getOfflineSentMessages(
    filterParams: GetSentMessagesRequestDto
  ): Promise<GetSentMessageResponseDto[]> {
    const queryBuilder =
      this.sentMessagesRepositoryWrapper.repository.createQueryBuilder(
        'sent_messages'
      );

    if (filterParams.transactionId) {
      queryBuilder.andWhere('sent_messages.transactionId = :transactionId', {
        transactionId: filterParams.transactionId,
      });
    }

    if (filterParams.fqcn) {
      queryBuilder.andWhere('sent_messages.fqcn = :fqcn', {
        fqcn: filterParams.fqcn,
      });
    }

    if (filterParams.initiatingMessageId) {
      queryBuilder.andWhere(
        'sent_messages.initiatingMessageId = :initiatingMessageId',
        {
          initiatingMessageId: filterParams.initiatingMessageId,
        }
      );
    }

    if (filterParams.initiatingTransactionId) {
      queryBuilder.andWhere(
        'sent_messages.initiatingTransactionId = :initiatingTransactionId',
        {
          initiatingTransactionId: filterParams.initiatingTransactionId,
        }
      );
    }

    // :project = ANY ( string_to_array(students.projects, ','))

    if (filterParams.messageId) {
      queryBuilder.andWhere(
        ':messageId = ANY(sent_messages."messageIds"::text[])',
        {
          messageId: `${filterParams.messageId}`,
        }
      );
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
      return await Promise.all(
        entities.map(async (entity: SentMessageEntity) => {
          const relatedMessagesCount =
            await this.sentMessagesRepositoryWrapper.repository
              .createQueryBuilder('sent_messages')
              .where('sent_messages.initiatingMessageId IN (:...messageIds)', {
                messageIds: entity.messageIds,
              })
              .orWhere(
                'sent_messages.initiatingTransactionId = :transactionId',
                {
                  transactionId: entity.transactionId,
                }
              )
              .getCount();

          return {
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
            timestampNanos: entity.timestampNanos,
            topicVersion: entity.topicVersion,
            totalSent: +entity.totalSent,
            totalFailed: +entity.totalFailed,
            transactionId: entity.transactionId,
            totalRecipients: +entity.totalRecipients,
            updatedDate: entity.updatedDate,
          } as GetSentMessageResponseDto;
        })
      );
    });
  }

  public async getOfflineReceivedMessages(
    dto: Partial<GetMessagesDto>
  ): Promise<GetMessageResponse[]> {
    const {
      initiatingTransactionId,
      initiatingMessageId,
      fqcn,
      from,
      amount,
      topicName,
      topicOwner,
      clientId,
      messageId,
    } = dto;

    const rm = 'rm';
    const rms = 'rms';

    const query = this.receivedMessageRepositoryWrapper.repository
      .createQueryBuilder(rm)
      .leftJoinAndSelect(`${rm}.receivedMessagesReadStatus`, rms)
      .where((qb) => {
        qb.where(`${rms}.messageId IS NULL`);

        if (fqcn) {
          qb.andWhere(`${rm}.fqcn = :fqcn`, { fqcn });
        }

        if (from) {
          qb.andWhere(`${rm}.timestampNanos = :from`, {
            from: moment(from).utc().toDate(),
          });
        }

        if (topicOwner) {
          qb.andWhere(`${rm}.topicOwner = :topicOwner`, { topicOwner });
        }

        if (topicName) {
          qb.andWhere(`${rm}.topicName = :topicName`, { topicName });
        }

        if (initiatingMessageId) {
          qb.andWhere(`${rm}.initiatingMessageId = :initiatingMessageId`, {
            initiatingMessageId,
          });
        }

        if (initiatingTransactionId) {
          qb.andWhere(
            `${rm}.initiatingTransactionId = :initiatingTransactionId`,
            { initiatingTransactionId }
          );
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

    const receivedMessages: GetMessageResponse[] = await Promise.all(
      messages.map(async (message: ReceivedMessageEntity) => {
        const isSignatureValid: boolean =
          await this.keysService.verifySignature(
            message.senderDid,
            message.signature,
            message.payload,
            prefetchedSignatureKeys[message.senderDid]
          );

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
          clientGatewayMessageId: message.clientGatewayMessageId,
          sender: message.senderDid,
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
          timestampNanos: 1,
          id: message.messageId,
          topicId: message.topicId,
          topicSchemaType: 'JSD7',
          signatureValid: isSignatureValid
            ? EncryptionStatus.SUCCESS
            : EncryptionStatus.FAILED,
        };
      })
    );

    await this.ackMessages(receivedMessages);

    return receivedMessages;
  }

  protected async ackMessages(messages: GetMessageResponse[]): Promise<void> {
    for (const message of messages) {
      try {
        await this.receivedMessageReadStatusRepositoryWrapper.repository.save({
          messageId: message.id,
          recipientUser: '@TODO LATER',
        });
      } catch (e) {
        this.logger.error(`failed to mark message as read ${message.id}`);
        this.logger.error(e);
      }
    }
  }
}
