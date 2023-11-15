import { PostTopicDtoSchemaType } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export type TMessage = {
  timestamp: string;
  timestampNanos: number;
  sender: string;
  fileData: {
    payload: string;
    contentType: string;
  };
  details: {
    topicOwner: string;
    topicName: string;
    topicVersion: string;
    messageId: string;
  };
  schemaType: PostTopicDtoSchemaType;
};
