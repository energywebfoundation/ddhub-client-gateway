import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class UploadFailedException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor(msg) {
    super(
      msg,
      DsbClientGatewayErrors.UPLOAD_FAILED
    );
  }
}
