import { EncryptionStatus } from './message.const';
import { Readable } from 'stream';

export interface SendMessageSuccessResponse {
  did: string;
  messageId: string;
  statusCode: number;
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

export interface Recipients {
  total: number;
  sent: number;
  failed: number;
}

export interface Details {
  did?: string;
  messageId?: string;
  statusCode?: number;
}

export interface Status {
  details: Details[];
  name: string;
}
export interface SendMessageResponse {
  clientGatewayMessageId: string;
  did: string;
  recipients: Recipients;
  status: Status[];
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
  payloadEncryption: boolean;
  clientGatewayMessageId: string;
  initiatingMessageId?: string;
  initiatingTransactionId?: string;
}

export interface Decryption {
  status: EncryptionStatus;
  errorMessage?: string;
}
export interface GetMessageResponse {
  id: string;
  topicName: string;
  topicOwner: string;
  topicVersion: string;
  topicSchemaType: string;
  payload: string;
  signature: string;
  sender: string;
  timestampNanos: number;
  timestampISO?: string;
  transactionId: string;
  signatureValid: EncryptionStatus;
  decryption: Decryption;
  initiatingMessageId?: string;
  initiatingTransactionId?: string;
  payloadEncryption: boolean;
  clientGatewayMessageId: string;
  topicId: string;
  relatedMessagesCount?: number;
  isRead?: boolean;
}

export interface DownloadMessageResponse {
  fileName: string;
  sender: string;
  signature: string;
  clientGatewayMessageId: string;
  data: Readable;
}
