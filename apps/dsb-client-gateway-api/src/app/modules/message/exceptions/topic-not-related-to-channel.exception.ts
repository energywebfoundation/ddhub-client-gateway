import { BadRequestException } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

export class TopicNotRelatedToChannelException extends BadRequestException {
  public code: DsbClientGatewayErrors;

  constructor(public readonly additionalDetails) {
    super('topic not related to channel');
    this.code = DsbClientGatewayErrors.TOPIC_NOT_RELATED_TO_CHANNEL;
  }
}
