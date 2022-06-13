import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class FileTypeNotSupportedException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super(
      'File type should be csv',
      DsbClientGatewayErrors.FILE_TYPE_NOT_MATCHED
    );
  }
}
