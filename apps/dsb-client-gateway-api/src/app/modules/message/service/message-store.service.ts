import { Injectable, Logger } from '@nestjs/common';
import {
  ReceivedMessageEntity,
  ReceivedMessageMappingRepositoryWrapper,
  ReceivedMessageRepositoryWrapper,
  SentMessageEntity,
  SentMessageRecipientRepositoryWrapper,
  SentMessageRepositoryWrapper,
  TopicEntity,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import {
  ConfigDto,
  DdhubConfigService,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import moment from 'moment/moment';

interface StoreSentMessage {
  initiatingMessageId?: string | null;
  messageIds: string[];
  topicOwner: string;
  topicName: string;
  filePath?: string;
  initiatingTransactionId?: string | null;
  clientGatewayMessageId: string;
  topic: TopicEntity;
  transactionId: string | null;
  signature: string;
  fqcn: string;
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
  initiatingMessageId?: string | null;
  initiatingTransactionId?: string | null;
  clientGatewayMessageId: string;
  topic: TopicEntity;
  topicVersion: string;
  transactionId: string;
  signature: string;
  senderDid: string;
  payloadEncryption: boolean;
  fqcn: string;
  payload: string;
  timestampNanos: Date;
  isFile: boolean;
}

@Injectable()
export class MessageStoreService {
  protected readonly logger = new Logger(MessageStoreService.name);

  constructor(
    protected readonly receivedMessageRepositoryWrapper: ReceivedMessageRepositoryWrapper,
    protected readonly sentMessageRepositoryWrapper: SentMessageRepositoryWrapper,
    protected readonly ddhubConfigService: DdhubConfigService,
    protected readonly sentMessageRecipientsRepositoryWrapper: SentMessageRecipientRepositoryWrapper,
    protected readonly receivedMessageMappingRepositoryWrapper: ReceivedMessageMappingRepositoryWrapper
  ) {}

  public async deleteExpiredMessages(): Promise<void> {
    const config: ConfigDto = await this.ddhubConfigService.getConfig();

    const expiresOn = moment()
      .subtract(config.msgExpired, 'milliseconds')
      .utc()
      .toDate();

    try {
      this.logger.log('attempting to delete expired received messages');

      await this.receivedMessageRepositoryWrapper.repository
        .createQueryBuilder()
        .delete()
        .where('createdDate <= :expiresOn', { expiresOn })
        .execute();

      this.logger.log('deleted expired received messages');
    } catch (e) {
      this.logger.error('failed to delete expired received messages ');
      this.logger.error(e);
    }

    try {
      this.logger.log('attempting to delete expired sent messages');

      await this.sentMessageRepositoryWrapper.repository
        .createQueryBuilder()
        .delete()
        .where('createdDate <= :expiresOn', { expiresOn })
        .execute();

      this.logger.log('deleted sent messages');
    } catch (e) {
      this.logger.error('failed to delete sent messages');
      this.logger.error(e);
    }
  }

  public async storeReceivedMessage(
    payload: StoreReceivedMessage[]
  ): Promise<void> {
    const entities: Array<{ entity: ReceivedMessageEntity; fqcn: string }> =
      await Promise.all(
        payload.map(async (item: StoreReceivedMessage) => {
          const entity = new ReceivedMessageEntity();

          entity.messageId = item.messageId;
          entity.payload = item.payload;
          entity.signature = item.signature;
          entity.senderDid = item.senderDid;
          entity.fqcn = item.fqcn;
          entity.initiatingTransactionId = item.initiatingMessageId;
          entity.initiatingMessageId = item.initiatingMessageId;
          entity.clientGatewayMessageId = item.clientGatewayMessageId;
          entity.isFile = item.isFile;
          entity.payloadEncryption = item.payloadEncryption;
          entity.transactionId = item.transactionId;
          entity.topicId = item.topic.id;
          entity.topicName = item.topic.name;
          entity.topicOwner = item.topic.owner;
          entity.topicVersion = item.topicVersion;
          entity.timestampNanos = item.timestampNanos;

          return { entity, fqcn: item.fqcn };
        })
      );

    await this.receivedMessageRepositoryWrapper.repository.save(
      entities.map((entity) => entity.entity)
    );

    for (const entity of entities) {
      await this.receivedMessageMappingRepositoryWrapper.repository.save({
        message: entity.entity,
        fqcn: entity.fqcn,
      });
    }
  }

  public async storeRecipients(
    did: string,
    messageId: string,
    status: string,
    statusCode: string | number,
    clientGatewayMessageId: string
  ): Promise<void> {
    await this.sentMessageRecipientsRepositoryWrapper.repository
      .save({
        messageId,
        recipientDid: did,
        status: status,
        statusCode: +statusCode,
        clientGatewayMessageId,
      })
      .catch((e) => {
        this.logger.error(
          `failed to store recipient messageId: ${messageId}, did: ${did}`
        );
        this.logger.error(e);
      });
  }

  public async storeSentMessage(payload: StoreSentMessage[]): Promise<void> {
    const entities: SentMessageEntity[] = await Promise.all(
      payload.map(async (item: StoreSentMessage) => {
        const entity = new SentMessageEntity();

        entity.topicOwner = item.topicOwner;
        entity.topicName = item.topicName;
        entity.messageIds = item.messageIds;
        entity.clientGatewayMessageId = item.clientGatewayMessageId;
        entity.initiatingMessageId = item.initiatingMessageId ?? null;
        entity.initiatingTransactionId = item.initiatingTransactionId ?? null;
        entity.senderDid = item.senderDid;
        entity.transactionId = item.transactionId;
        entity.signature = item.signature;
        entity.topicVersion = item.topic.version;
        entity.topicId = item.topic.id;
        entity.fqcn = item.fqcn;
        entity.payloadEncryption = item.payloadEncryption;
        entity.payload = item.payload;
        entity.timestampNanos = item.timestampNanos;
        entity.isFile = item.isFile;
        entity.totalRecipients = item.totalRecipients;
        entity.totalSent = item.totalSent;
        entity.totalFailed = item.totalFailed;
        entity.filePath = item.filePath;

        return entity;
      })
    );

    await this.sentMessageRepositoryWrapper.repository.save(entities);
  }
}
