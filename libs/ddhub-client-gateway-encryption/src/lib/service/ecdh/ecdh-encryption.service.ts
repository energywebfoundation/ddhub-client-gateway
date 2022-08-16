import * as Crypto from 'crypto';
import { EcdhKeyService } from './ecdh-key.service';
import { Injectable, Logger } from '@nestjs/common';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { KeyEntity } from '@dsb-client-gateway/dsb-client-gateway-storage';
import moment from 'moment';
import { ConfigService } from '@nestjs/config';
import { EncryptionService } from '../encryption.service';
import { RsaKeyService } from '../rsa/rsa-key.service';
import { CommandBus } from '@nestjs/cqrs';
import { GenerateEcdhKeyCommand } from '../../command/generate-ecdh-key.command';

@Injectable()
export class EcdhEncryptionService extends EncryptionService {
  protected readonly curve = 'secp256k1';
  protected readonly symmetricAlgorithm = 'aes-256-cbc';
  protected readonly logger = new Logger(EcdhEncryptionService.name);

  constructor(
    protected readonly ecdhKeyService: EcdhKeyService,
    protected readonly rsaKeyService: RsaKeyService,
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly configService: ConfigService,
    protected readonly commandBus: CommandBus
  ) {
    super(rsaKeyService);
  }

  public async createCipheriv(
    did: string
  ): Promise<[Crypto.Cipher, Buffer] | null> {
    const iv: Buffer = Crypto.randomBytes(16);
    const senderEcdh: Crypto.ECDH = Crypto.createECDH(this.curve);

    const key: string | null =
      await this.ecdhKeyService.getSenderLatestAvailable();

    if (!key) {
      this.logger.error('there is no ECDH key');

      await this.commandBus.execute(new GenerateEcdhKeyCommand());

      return this.createCipheriv(did);
    }

    senderEcdh.setPrivateKey(key, 'hex');

    const senderDidActiveKey: KeyEntity | null =
      await this.ecdhKeyService.getReceiverLatestAvailable(did);

    if (!senderDidActiveKey) {
      this.logger.error(`${did} does not have available, active key`);

      return;
    }

    const computedPrivateKey: Buffer = senderEcdh.computeSecret(
      senderDidActiveKey.key,
      'hex'
    );

    return [
      Crypto.createCipheriv(this.symmetricAlgorithm, computedPrivateKey, iv),
      iv,
    ];
  }

  public async createDecipheriv(
    senderDid: string,
    iv: string,
    clientGatewayMessageId: string,
    timestampUtc: number
  ): Promise<[Crypto.Decipher, Buffer] | null> {
    const timestamp: moment.Moment = moment(timestampUtc);
    const key: string | null =
      await this.ecdhKeyService.getSenderLatestAvailable(timestamp);

    if (!key) {
      this.logger.error(
        `no key available to decrypt for ${clientGatewayMessageId}`
      );

      return null;
    }

    const receiver = Crypto.createECDH(this.curve);
    receiver.setPrivateKey(key, 'hex');

    const senderKey: KeyEntity | null =
      await this.ecdhKeyService.getReceiverLatestAvailable(
        senderDid,
        timestamp
      );

    if (!senderKey) {
      this.logger.error(
        `sender ${senderDid} does not have available matching public key`
      );

      return null;
    }

    const computedSharedKey: Buffer = receiver.computeSecret(
      senderKey.key,
      'hex'
    );

    const receiverDecipher: Crypto.Decipher = Crypto.createDecipheriv(
      this.symmetricAlgorithm,
      computedSharedKey,
      Buffer.from(iv, 'hex')
    );

    return [receiverDecipher, Buffer.from(iv, 'hex')];
  }

  public async encryptMessage(
    message: string | Buffer,
    did: string
  ): Promise<string | null> {
    const cipheriv: [Crypto.Cipher, Buffer] | null = await this.createCipheriv(
      did
    );

    if (!cipheriv) {
      this.logger.error('could not create cipheriv');

      return null;
    }

    const [cipher, iv]: [Crypto.Cipher, Buffer] = cipheriv;

    return (
      `${iv.toString('hex')}:` +
      cipher.update(message.toString('hex'), 'utf-8', 'hex') +
      cipher.final('hex')
    );
  }

  public async decryptMessage(
    encryptedMessage: string,
    clientGatewayMessageId: string,
    timestampUtc: number,
    senderDid: string
  ): Promise<string | null> {
    const iv: string = encryptedMessage.split(':')[0];

    const decipheriv: [Crypto.Decipher, Buffer] = await this.createDecipheriv(
      senderDid,
      iv,
      clientGatewayMessageId,
      timestampUtc
    );

    if (!decipheriv) {
      return null;
    }

    const [decipher]: [Crypto.Decipher, Buffer] = decipheriv;

    let decrypted: string = decipher.update(encryptedMessage, 'hex', 'utf-8');

    decrypted = decrypted + decipher.final('utf-8');

    return decrypted;
  }
}
