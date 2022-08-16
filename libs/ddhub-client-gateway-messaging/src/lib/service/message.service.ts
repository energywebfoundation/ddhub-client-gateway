import {
  DownloadMessage,
  GetMessages,
  SendMessage,
  UploadMessage,
} from '../message.interface';
import {
  DownloadMessageResponse,
  GetMessagesResponse,
  SendMessageResponse,
  SendMessageResponseFile,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { SignatureService } from './signature.service';

export abstract class MessageService {
  protected constructor(
    protected readonly signatureService: SignatureService
  ) {}

  abstract sendMessage(message: SendMessage): Promise<SendMessageResponse>;
  abstract getMessages(query: GetMessages): Promise<GetMessagesResponse>;
  abstract uploadMessage(
    payload: UploadMessage
  ): Promise<SendMessageResponseFile>;
  abstract downloadMessages(
    query: DownloadMessage
  ): Promise<DownloadMessageResponse>;
}
