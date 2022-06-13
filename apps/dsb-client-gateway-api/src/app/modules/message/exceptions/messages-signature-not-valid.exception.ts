import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class MessageSignatureNotValidException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor(fileId: string, receivedSignature: string) {
    super(
      'Signature verfication failed',
      DsbClientGatewayErrors.SIGNATURE_DOES_NOT_MATCH,
      {
        fileId,
        receivedSignature,
      }
    );
  }
}
