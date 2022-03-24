import * as crypto from 'crypto';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IamService } from '../../iam-service/service/iam.service';
import { SecretsEngineService } from '../../secrets-engine/secrets-engine.interface';
import HDKEY from 'hdkey';
import { DIDPublicKeyTags } from '../keys.const';
import moment from 'moment';

@Injectable()
export class KeysService implements OnModuleInit {
  private readonly logger = new Logger(KeysService.name);
  private readonly curve = 'secp256k1';
  private readonly symmetricAlgorithm = 'aes-256-cbc';
  private readonly hashAlgorithm = 'sha256';

  constructor(
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly iamService: IamService
  ) {}

  public async encryptSymmetricKey(
    key: string,
    receiverDid: string
  ): Promise<void> {
    const did = await this.iamService.getDid(receiverDid);

    // const key = did.publicKey.find(({ id }) => {
    //   return (
    //     id === `${receiverDid}#${DIDPublicKeyTags.DSB_SYMMETRIC_ENCRYPTION}`
    //   );
    // });
  }

  public async encryptMessage(content: string | Buffer): Promise<void> {
    const iv = crypto.randomBytes(16);
  }

  public async onModuleInit(): Promise<void> {
    const rootKey: string | null =
      await this.secretsEngineService.getPrivateKey();

    if (!rootKey) {
      this.logger.log('Not deriving RSA key due to missing private key');
    }

    const currentDate: number = +moment().format('YYYYMMDD');

    const masterSeed = HDKEY.fromMasterSeed(Buffer.from(rootKey, 'hex'));

    const derivedKeyAtDay = masterSeed.derive(
      `m/44' /246' /0' /${currentDate}`
    );

    const derivedPrivateKeyHash = crypto
      .createHash('sha256')
      .update(derivedKeyAtDay.privateKey)
      .digest('hex');

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: derivedPrivateKeyHash,
      },
    });

    await this.iamService.setVerificationMethod(
      publicKey,
      DIDPublicKeyTags.DSB_SYMMETRIC_ENCRYPTION
    );

    this.logger.log('Updated DID document with public key');
  }
}
