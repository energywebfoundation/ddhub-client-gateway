import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class FileNameInvalidException extends BaseException {
  constructor() {
    super('File name invalid', DsbClientGatewayErrors.FILE_NAME_INVALID);
  }
}
