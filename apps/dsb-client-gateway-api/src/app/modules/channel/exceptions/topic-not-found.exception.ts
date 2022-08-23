import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class TopicNotFoundException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor(message?: string) {
    super(
      message ? message : 'Topic not found',
      DsbClientGatewayErrors.TOPIC_NOT_FOUND
    );
  }
}
