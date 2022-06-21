import { Readable } from 'stream';

export interface DownloadMessageResponse {
  fileName: string;
  sender: string;
  signature: string;
  clientGatewayMessageId: string;
  data: Readable;
}
