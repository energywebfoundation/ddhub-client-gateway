import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class TopicNotRelatedToChannelException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super(
      'Topic not related to channel',
      DsbClientGatewayErrors.TOPIC_NOT_RELATED_TO_CHANNEL
    );
  }
}
