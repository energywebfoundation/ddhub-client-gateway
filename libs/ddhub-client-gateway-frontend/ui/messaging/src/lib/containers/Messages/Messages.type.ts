import { PostTopicDtoSchemaType } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export type TMessage = {
  timestampNanos: string;
  sender: string;
  fileData: {
    payload: string;
    contentType: string;
  }
  schemaType?: PostTopicDtoSchemaType;
};
