import { Injectable, Logger } from '@nestjs/common';
import {
  ReceivedMessageEntity,
  ReceivedMessageRepositoryWrapper,
  SentMessageEntity,
  SentMessageRepositoryWrapper,
  TopicEntity,
} from '@dsb-client-gateway/dsb-client-gateway-storage';

interface StoreSentMessage {
  initiatingMessageId?: string | null;
  clientGatewayMessageId: string;
  topic: TopicEntity;
  transactionId: string | null;
  signature: string;
  senderDid: string;
  payloadEncryption: boolean;
  payload: string;
  timestampNanos: Date;
  isFile: boolean;
  totalRecipients: number;
  totalSent: number;
  totalFailed: number;
}

interface StoreReceivedMessage {
  messageId: string;
  initiatingMessageId: string;
  clientGatewayMessageId: string;
  topic: TopicEntity; // You would need to define the TopicEntity interface
  topicVersion: string;
  transactionId: string;
  signature: string;
  senderDid: string;
  payloadEncryption: boolean;
  payload: string;
  timestampNanos: Date;
  isFile: boolean;
}

@Injectable()
export class MessageStoreService {
  protected readonly logger = new Logger(MessageStoreService.name);

  constructor(
    protected readonly receivedMessageRepositoryWrapper: ReceivedMessageRepositoryWrapper,
    protected readonly sentMessageRepositoryWrapper: SentMessageRepositoryWrapper
  ) {}

  public async storeReceivedMessage(
    payload: StoreReceivedMessage[]
  ): Promise<void> {
    const entities: ReceivedMessageEntity[] = await Promise.all(
      payload.map(async (item: StoreReceivedMessage) => {
        const entity = new ReceivedMessageEntity();

        entity.messageId = item.messageId;
        entity.payload = item.payload;
        entity.signature = item.signature;
        entity.senderDid = item.senderDid;
        entity.initiatingMessageId = item.initiatingMessageId;
        entity.clientGatewayMessageId = item.clientGatewayMessageId;
        entity.isFile = false;
        entity.payloadEncryption = item.payloadEncryption;
        entity.topic = item.topic;
        entity.transactionId = item.transactionId;
        entity.topicVersion = item.topic.version;

        return entity;
      })
    );

    await this.receivedMessageRepositoryWrapper.repository.save(entities);
  }

  public async storeSentMessage(payload: StoreSentMessage[]): Promise<void> {
    const entities: SentMessageEntity[] = await Promise.all(
      payload.map(async (item: StoreSentMessage) => {
        const entity = new SentMessageEntity();

        entity.clientGatewayMessageId = item.clientGatewayMessageId;
        entity.initiatingMessageId = item.initiatingMessageId ?? null;
        entity.topic = item.topic;
        entity.topicVersion = item.topic.version;
        entity.transactionId = item.transactionId;
        entity.signature = item.signature;
        entity.payloadEncryption = item.payloadEncryption;
        entity.payload = item.payload;
        entity.timestampNanos = item.timestampNanos;
        entity.isFile = false;
        entity.totalRecipients = item.totalRecipients;
        entity.totalSent = item.totalSent;
        entity.totalFailed = item.totalFailed;

        return entity;
      })
    );

    await this.sentMessageRepositoryWrapper.repository.save(entities);
  }
}
