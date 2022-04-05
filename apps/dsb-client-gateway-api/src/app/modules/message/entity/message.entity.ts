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

export interface Recipients {
  total: number;
  sent: number;
  failed: number;
}

export interface SendInternalMessageResponse {
  id: string;
}
export interface SendMessageResponse {
  clientGatewayMessageId: string;
  recipients: Recipients;
  did: string;
  success: SendMessageSuccessResponse[];
  failed: SendMessageFailedResponse[];
}

export interface InternalMessageEntity {
  transactionId: string;
  clientGatewayMessageId: string;
  payload: string;
  topicId: string;
  topicVersion: string;
  signature: string;
  isFile: boolean;
  senderDid?: string;
  createdAt?: string;
  updatedAt?: string;
}
