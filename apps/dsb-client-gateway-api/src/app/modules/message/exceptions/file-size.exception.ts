import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class FileSizeException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor(maxFileSize) {
    super(
      'File is to big',
      DsbClientGatewayErrors.FILE_SIZE_GREATER_THEN_100_MB,
      {
        maxFileSize,
      }
    );
  }
}
