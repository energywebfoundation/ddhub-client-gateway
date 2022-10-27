import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class AckPendingNotFoundException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super('Ack Pending not found', DsbClientGatewayErrors.MB_ACK_PENDING);
  }
}
