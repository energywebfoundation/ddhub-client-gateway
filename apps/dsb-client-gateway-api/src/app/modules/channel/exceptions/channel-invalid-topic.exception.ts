import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class ChannelInvalidTopicException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor(topicId: string) {
    super(
      'Topic assigned to channel has invalid schema type',
      DsbClientGatewayErrors.CHANNEL_TOPIC_SCHEMA_TYPE_INVALID,
      {
        topicId,
      }
    );
  }
}
