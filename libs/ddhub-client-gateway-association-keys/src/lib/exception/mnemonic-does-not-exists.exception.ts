import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class MnemonicDoesNotExistsException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super(
      'Mnemonic does not exists',
      DsbClientGatewayErrors.BIP39_MNEMONIC_DOES_NOT_EXISTS,
    );
  }
}
