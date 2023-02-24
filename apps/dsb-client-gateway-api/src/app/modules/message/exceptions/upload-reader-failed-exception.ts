import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class UploadReaderFailedException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super(
      'File stream reader failed',
      DsbClientGatewayErrors.UPLOAD_READER_FAILED
    );
  }
}
