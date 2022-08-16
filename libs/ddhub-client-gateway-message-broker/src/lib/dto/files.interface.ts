import { Readable } from 'stream';

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

export interface SendMessageResponseFile {
  clientGatewayMessageId: string;
  did: string;
  recipients: Recipients;
  status: Status[];
}

export interface DownloadMessageResponse {
  fileName: string;
  sender: string;
  signature: string;
  clientGatewayMessageId: string;
  data: Readable;
}
