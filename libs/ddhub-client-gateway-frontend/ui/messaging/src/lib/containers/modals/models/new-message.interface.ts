export interface INewMessage {
  fqcn: string;
  topicId: string;
  topicName: string;
  topicOwner: string;
  version: string;
  schema: string;
  uiSchema: string;
  message: any;
  transactionId: string;
}
