import { NotFoundException } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

export class TopicNotFoundException extends NotFoundException {
    public code: DsbClientGatewayErrors;

    constructor() {
        super('Topic not found');

        this.code = DsbClientGatewayErrors.TOPIC_NOT_FOUND;
    }
}