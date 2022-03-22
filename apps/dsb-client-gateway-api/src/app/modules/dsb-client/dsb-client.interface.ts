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

export interface TopicData {
  id: string;
  namespace: string;
  owner: string;
  schema: string;
  schemaType: string;
  version: string;
}

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
  fqcn: string;
  topic: string;
  payload: string;
  transactionId?: string;
  signature: string;
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
