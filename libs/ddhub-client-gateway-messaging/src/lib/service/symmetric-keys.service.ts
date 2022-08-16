import { Injectable, Logger } from '@nestjs/common';
import { EcdhEncryptionService } from '@dsb-client-gateway/ddhub-client-gateway-encryption';
import { DdhubMessagesService } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';

@Injectable()
export class SymmetricKeysService {
  constructor(
    protected readonly ecdhEncryptionService: EcdhEncryptionService,
    protected readonly ddhubMessageService: DdhubMessagesService
  ) {}

  public async send(
    qualifiedDids: string[],
    decryptionKey: string,
    clientGatewayMessageId: string,
    contextLogger: Logger
  ): Promise<void> {
    for (const recipientDid of qualifiedDids) {
      const encryptedSymmetricKey =
        await this.ecdhEncryptionService.encryptMessage(
          decryptionKey,
          recipientDid
        );

      contextLogger.log(encryptedSymmetricKey);

      await this.ddhubMessageService.sendMessageInternal(
        recipientDid,
        clientGatewayMessageId,
        encryptedSymmetricKey
      );

      contextLogger.debug(`send symmetric key to ${recipientDid}`);
    } // @TODO - error hnadler
  }
}
