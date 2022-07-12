import {
  DownloadMessage,
  GetMessages,
  SendMessage,
  UploadMessage,
} from '../message.interface';

export abstract class MessageService {
  abstract sendMessage(message: SendMessage): Promise<any>;
  abstract getMessages(query: GetMessages): Promise<any>;
  abstract uploadMessage(payload: UploadMessage): Promise<any>;
  abstract downloadMessages(query: DownloadMessage): Promise<any>;
}
