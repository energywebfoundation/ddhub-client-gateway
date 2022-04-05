import { IAppDefinition } from '@energyweb/iam-contracts';
export interface Topic {
  namespace: string;
  schema: object | string;
}

export interface PaginatedData<T> {
  count: number;
  limit: number;
  page: number;
  records: T[];
}

export type TopicDataResponse = PaginatedData<TopicData>;

export interface TopicVersion {
  name: string;
  owner: string;
  schema: object;
  schemaType: string;
  tags: string[];
  version: string;
  topicId: string;
}

export type TopicVersionResponse = PaginatedData<TopicVersion>;

export interface TopicData {
  id: string;
  name: string;
  owner: string;
  schema: object | string;
  schemaType: string;
  tags: string[];
  version: string;
}

export class ApplicationDTO implements IAppDefinition {
  appName: string;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
  namespace?: string;
  topicsCount?: number;
}

export interface ApplicationHeader {
  id?: string;
  Header?: string;
  accessor: string;
  filter?: string;
  Cell?: any;
}

export type TopicResultDTO = {
  id: string;
  name: string;
  schemaType: string;
  schema: string;
  version: string;
  owner: string;
  tags: string[];
};

export type GetTopicsOptions = {
  limit?: number;
  name: string;
  owner: string;
  page?: number;
  tags?: string[];
};

export type SendTopicBodyDTO = {
  name: string;
  schemaType: string;
  schema: string;
  version: string;
  owner: string;
  tags: string[];
};

export class ChannelDTO {
  fqcn: string;
  topics?: Topic[];
  admins?: string[];
  publishers?: string[];
  subscribers?: string[];
  maxMsgAge?: number;
  maxMsgSize?: number;
  createdBy: string;
  createdDateTime: string;
  modifiedBy?: string;
  modifiedDateTime?: string;
}

export interface Channel {
  fqcn: string;
  topics?: Topic[];
  admins?: string[];
  publishers?: string[];
  subscribers?: string[];
  maxMsgAge?: number;
  maxMsgSize?: number;
  createdBy: string;
  createdDateTime: string;
  modifiedBy?: string;
  modifiedDateTime?: string;
}

export interface SendMessageData {
  fqcns: string[];
  payload: string;
  clientGatewayMessageId: string;
  transactionId?: string;
  topicId: string;
  topicVersion: string;
  signature: string;
}
export interface SendInternalMessageRequestDTO {
  fqcn: string;
  clientGatewayMessageId: string;
  payload: string;
}

export interface SendMessageSuccessResponse {
  did: string;
  messageId: string;
  statusCode: number;
  err: {
    code: string;
    reason: string;
    additionalInformation: object;
  };
}
export interface SendMessageFailedResponse {
  did: string;
  messageId: string;
  statusCode: number;
  err: {
    code: string;
    reason: string;
    additionalInformation: object;
  };
}

export interface SendInternalMessageResponse {
  id: string;
}

export interface GetInternalMessageResponse {
  transactionId: string;
  clientGatewayMessageId: string;
  payload: string;
  topicId: string;
  topicVersion: string;
  signature: string;
  isFile: boolean;
}
export interface Recipients {
  total: number;
  sent: number;
  failed: number;
}

export interface details {
  did?: string;
  messageId?: string;
  statusCode?: number;
}

export interface status {
  details: details[];
  name: string;
}
export interface SendMessageResponse {
  clientGatewayMessageId: string;
  did: string;
  recipients: Recipients;
  status: status[];
}

export interface SendMessageResult {
  id: string;
}

export interface Message {
  id: string;
  fqcn?: string;
  topic: string;
  payload: string;
  sender: string;
  signature: string;
  timestampNanos: number;
  transactionId?: string;
}

export interface SearchMessageResponseDto {
  messageId: string;
  topicId: string;
  topicVersion: string;
  transactionId: string;
  signature: string;
  payload: string;
  senderDid: string;
  timestampNanos: number;
  isFile: boolean;
  clientGatewayMessageId: string;
}

export interface FileDownloadResposneDto {
  file: string;
}
