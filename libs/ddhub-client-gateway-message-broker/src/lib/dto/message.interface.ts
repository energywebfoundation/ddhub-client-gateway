import { Recipients, Status } from './files.interface';

export interface SearchMessageResponseDto {
  messageId: string;
  topicId: string;
  topicVersion: string;
  transactionId: string;
  signature: string;
  payload: string;
  senderDid: string;
  payloadEncryption: boolean;
  timestampNanos: number;
  isFile: boolean;
  clientGatewayMessageId: string;
}

export interface SendMessageData {
  fqcns: string[];
  payload: string;
  payloadEncryption: boolean;
  clientGatewayMessageId: string;
  transactionId?: string;
  topicId: string;
  topicVersion: string;
  signature: string;
  anonymousRecipient: string[];
}

export interface SendInternalMessageRequestDTO {
  fqcn: string;
  clientGatewayMessageId: string;
  payload: string;
}

export interface GetInternalMessageResponse {
  transactionId: string;
  clientGatewayMessageId: string;
  payload: string;
  senderDid: string;
  topicId: string;
  topicVersion: string;
  signature: string;
  isFile: boolean;
}

export interface SendInternalMessageResponse {
  id: string;
}

export interface SendInternalMessageRequestDTO {
  fqcn: string;
  clientGatewayMessageId: string;
  payload: string;
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

export interface SendMessageResponse {
  clientGatewayMessageId: string;
  did: string;
  recipients: Recipients;
  status: Status[];
}

export interface AckResponse {
  acked: string[];
  notFound: string[];
}
