import { Injectable, Logger } from '@nestjs/common';
import { GetMessagesDto } from '../dto/request/get-messages.dto';
import { GetMessageResponse } from '../message.interface';
import {
  DidEntity,
  ReceivedMessageEntity,
  ReceivedMessageReadStatusRepositoryWrapper,
  ReceivedMessageRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import moment from 'moment';
import { EncryptionStatus } from '../message.const';
import { KeysService } from '../../keys/service/keys.service';

@Injectable()
export class OfflineMessagesService {
  protected readonly logger = new Logger(OfflineMessagesService.name);

  constructor(
    protected readonly receivedMessageRepositoryWrapper: ReceivedMessageRepositoryWrapper,
    protected readonly receivedMessageReadStatusRepositoryWrapper: ReceivedMessageReadStatusRepositoryWrapper,
    protected readonly keysService: KeysService
  ) {}

  public async getOfflineMessages(
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

        if (clientId) {
          qb.andWhere(`${rm}.clientId = :clientId`, { clientId });
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
              'm.initiatingMessageId = :initiatingMessageId AND m.initiatingTransactionId = :initiatingTransactionId',
              {
                initiatingMessageId: message.initiatingMessageId,
                initiatingTransactionId: message.initiatingMessageId,
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
