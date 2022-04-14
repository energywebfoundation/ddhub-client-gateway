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
  clientGatewayMessageId: string;
}

export interface Decryption {
  status: boolean;
  errorMessage?: string;
}
export interface GetMessageResponse {
  id: string;
  topicName: string;
  topicOwner: string;
  topicVersion: string;
  payload: string;
  signature: string;
  sender: string;
  timestampNanos: number;
  transactionId: string;
  signatureValid: boolean;
  decryption: Decryption;
}

export interface DownloadMessageResponse {
  filePath: string;
  fileName: string;
  sender: string;
  signature: string;
  clientGatewayMessageId: string;
  data: Buffer;
}
