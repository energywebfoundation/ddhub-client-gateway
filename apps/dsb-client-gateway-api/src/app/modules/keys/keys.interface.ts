export interface KeysEntity {
  clientGatewayMessageId: string;
  payload: string;
  senderDid: string;
}

export interface DidKeys {
  did: string;
  publicRSAKey: string;
  publicSignatureKey: string;
}
