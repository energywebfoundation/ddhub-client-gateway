import { BadRequestException } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

export class TopicOwnerTopicNameRequiredException extends BadRequestException {
  public code: DsbClientGatewayErrors;

  constructor(public readonly additionalDetails) {
    super('Topic name and topic owner both fields are required');
    this.code = DsbClientGatewayErrors.TOPIC_OWNER_AND_NAME_REQUIRED;
  }
}
