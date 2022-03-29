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

export interface recipients {
  total: number;
  sent: number;
  failed: number;
}
export interface SendMessageResponse {
  clientGatewayMessageId: string;
  did: string;
  recipients: recipients;
  success: SendMessageSuccessResponse[];
  failed: SendMessageFailedResponse[];
}
