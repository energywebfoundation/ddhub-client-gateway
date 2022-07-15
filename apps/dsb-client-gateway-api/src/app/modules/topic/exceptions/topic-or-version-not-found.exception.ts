import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class TopicOrVersionNotFoundException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor(topicId,version) {
    super('Topic or version not found', DsbClientGatewayErrors.TOPIC_NOT_FOUND, {
      topicId,
      version
    });
  }
}
