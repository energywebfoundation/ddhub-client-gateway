import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class TopicOwnerTopicNameRequiredException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super(
      'Topic name and topic owner both fields are required',
      DsbClientGatewayErrors.TOPIC_OWNER_AND_NAME_REQUIRED
    );
  }
}
