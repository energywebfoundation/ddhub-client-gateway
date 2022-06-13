import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class ChannelUpdateRestrictedFieldsException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super(
      'Attempt to update restricted fields (channelName, type)',
      DsbClientGatewayErrors.CHANNEL_RESTRICTED_FIELDS_UPDATE
    );

    this.code = DsbClientGatewayErrors.CHANNEL_RESTRICTED_FIELDS_UPDATE;
  }
}
