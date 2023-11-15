import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class ChannelMessageFormsOnlyException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor(fqcn: string) {
    super(
      'Cannot fetch channel messages, only applicable when messageForms = true',
      DsbClientGatewayErrors.CHANNEL_MESSAGE_FORMS_ONLY,
      {
        fqcn,
      }
    );
  }
}
