import { PostTopicDtoSchemaType } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export type TMessage = {
  timestampNanos: string;
  sender: string;
  schemaType?: PostTopicDtoSchemaType;
  fileId: string;
};
