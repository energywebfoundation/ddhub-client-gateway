import { Injectable } from '@nestjs/common';
import { GetMessagesDto } from '../dto/request/get-messages.dto';
import { GetMessageResponse } from '../message.interface';
import {
  DidEntity,
  ReceivedMessageEntity,
  ReceivedMessageRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import moment from 'moment';
import { EncryptionStatus } from '../message.const';
import { KeysService } from '../../keys/service/keys.service';

@Injectable()
export class OfflineMessagesService {
  constructor(
    protected readonly receivedMessagesService: ReceivedMessageRepositoryWrapper,
    protected readonly keysService: KeysService
  ) {}

  public async getOfflineMessages(
    dto: GetMessagesDto
  ): Promise<GetMessageResponse[]> {
    const { fqcn, from, amount, topicName, topicOwner, clientId } = dto;

    const whereQuery: FindConditions<ReceivedMessageEntity> = {};

    if (fqcn) {
      whereQuery.fqcn = fqcn;
    }

    if (from) {
      whereQuery.timestampNanos = moment(from).utc().toDate();
    }

    if (topicOwner) {
      whereQuery.topicOwner = topicOwner;
    }

    if (topicName) {
      whereQuery.topicName = topicName;
    }

    const messages = await this.receivedMessagesService.repository.find({
      where: whereQuery,
      order: {
        timestampNanos: 'DESC',
      },
      take: amount ?? 3,
    });

    // @TODO - apply read status, exclude read messages from above query
    // do we need to respect clientId?

    const uniqueSenderDids: string[] = [
      ...new Set(messages.map(({ senderDid }) => senderDid)),
    ];

    const prefetchedSignatureKeys: Record<string, DidEntity | null> =
      await this.keysService.prefetchSignatureKeys(uniqueSenderDids);

    return await Promise.all(
      messages.map(async (message: ReceivedMessageEntity) => {
        const isSignatureValid: boolean =
          await this.keysService.verifySignature(
            message.senderDid,
            message.signature,
            message.payload,
            prefetchedSignatureKeys[message.senderDid]
          );

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
  }
}
