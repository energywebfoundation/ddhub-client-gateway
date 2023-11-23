import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class MaximumNumberOfClientsReachedException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor(max: number) {
    super(
      'Maximum number of clients reached',
      DsbClientGatewayErrors.MAXIMUM_NUMBER_OF_CLIENTS_REACHED,
      {
        maximumClients: max,
      },
    );
  }
}
