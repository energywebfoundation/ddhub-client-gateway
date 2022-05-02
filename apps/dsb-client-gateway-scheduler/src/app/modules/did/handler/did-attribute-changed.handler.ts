import { DidAttributeChangedCommand } from '@dsb-client-gateway/dsb-client-gateway-did-registry';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DidWrapperRepository } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { Span } from 'nestjs-otel';

@CommandHandler(DidAttributeChangedCommand)
export class DidAttributeChangedHandler
  implements ICommandHandler<DidAttributeChangedCommand>
{
  private readonly logger = new Logger(DidAttributeChangedHandler.name);

  constructor(
    protected readonly wrapper: DidWrapperRepository,
    protected readonly iamService: IamService
  ) {}

  @Span('didListener_attributeChanged')
  public async execute({ did }: DidAttributeChangedCommand): Promise<void> {
    const didDocument = await this.iamService.getDid(did);

    const rsaPublicKey = didDocument.publicKey.find(
      ({ id }) => id === `${did}#dsb-symmetric-encryption`
    );
    const publicSignatureKey = didDocument.publicKey.find(
      ({ id }) => id === `${did}#dsb-signature-key`
    );

    if (!publicSignatureKey || !rsaPublicKey) {
      this.logger.error(
        `${did} does not have #dsb-symmetric-encryption or #dsb-signature-key, not storing`
      );

      this.logger.debug(didDocument);

      return;
    }

    if (!publicSignatureKey.publicKeyHex) {
      this.logger.error(
        `${did} does not have publicKeyHex for public signature key`
      );

      return;
    }

    if (!rsaPublicKey.publicKeyHex) {
      this.logger.error(`${did} does not have publicKeyHex for public RSA key`);

      return;
    }

    await this.wrapper.didRepository.save({
      did: did,
      publicSignatureKey: publicSignatureKey.publicKeyHex,
      publicRSAKey: rsaPublicKey.publicKeyHex,
    });

    this.logger.log(`Updated ${did}`);
  }
}
