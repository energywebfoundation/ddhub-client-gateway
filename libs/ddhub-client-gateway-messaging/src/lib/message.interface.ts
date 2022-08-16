import {
  ChannelEntity,
  TopicEntity,
} from '@dsb-client-gateway/dsb-client-gateway-storage';

export interface SendMessage {
  topic: TopicEntity;
  channel: ChannelEntity;
  transactionId: string;
  payload: string;
  clientGatewayMessageId: string;
}

export interface GetMessages {
  channel: ChannelEntity;
  messages: any[];
}

export interface UploadMessage {
  file: Express.Multer.File;
  clientGatewayMessageId: string;
  transactionId: string;
  channel: ChannelEntity;
  topic: TopicEntity;
}

export interface DownloadMessage {
  fileId: string;
}

export interface UploadMessageResult {}
