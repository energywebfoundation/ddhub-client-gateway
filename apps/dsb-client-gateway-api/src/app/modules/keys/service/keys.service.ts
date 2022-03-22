import * as crypto from 'crypto';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';

import HDKEY from 'hdkey';
import { ec } from 'elliptic';
import BN from 'bn.js';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IamService } from '../../iam-service/service/iam.service';
import moment from 'moment';
import { SecretsEngineService } from '../../secrets-engine/secrets-engine.interface';

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

  public async onModuleInit(): Promise<void> {
    await this.generateMasterHDKey();
  }

  public encryptMessage(
    data: string,
    senderDerivedPrivateKey: string,
    receiverDerivedPublicKey: string
  ): string {
    const iv = crypto.randomBytes(16); // AES256-GCM requires 16 bytes iv

    const senderECDH = crypto.createECDH(this.curve);

    senderECDH.setPrivateKey(senderDerivedPrivateKey, 'hex');

    const computedSharedKey = senderECDH.computeSecret(
      receiverDerivedPublicKey,
      'hex'
    );

    const senderCipher = crypto.createCipheriv(
      this.symmetricAlgorithm,
      computedSharedKey,
      iv
    );

    return (
      `${iv.toString('hex')}:` +
      senderCipher.update(data, 'utf-8', 'hex') +
      senderCipher.final('hex')
    );
  }

  public verifySignature(
    encryptedData: string,
    signature: string,
    senderPublicKey: string
  ): boolean {
    const EC = new ec(this.curve);

    const keyPair = EC.keyFromPublic(senderPublicKey, 'hex');
    const hash = crypto
      .createHash(this.hashAlgorithm)
      .update(encryptedData)
      .digest('hex');

    const r = new BN(signature.slice(0, 64), 16).toString('hex');
    const s = new BN(signature.slice(64, 128), 16).toString('hex');

    return keyPair.verify(hash, { r, s });
  }

  public async createSignature(
    encryptedData: string,
    senderExtendedPrivateKey: string
  ): Promise<string> {
    const EC = new ec(this.curve);

    const keyPair = EC.keyFromPrivate(senderExtendedPrivateKey);
    const hash = crypto
      .createHash(this.hashAlgorithm)
      .update(encryptedData)
      .digest('hex');

    const signature = keyPair.sign(hash, 'hex', {
      canonical: true,
      pers: true,
    });

    return signature.r.toString(16, 64) + signature.s.toString(16, 64);
  }

  public async generateMasterHDKey(): Promise<void> {
    if (!this.iamService.getDIDAddress()) {
      this.logger.warn('Skipping keys as IAM is not initialized');

      return;
    }

    const currentKeys = await this.secretsEngineService.getEncryptionKeys();

    if (currentKeys) {
      this.logger.log('Master keys already exists');

      await this.deriveKeys();

      return;
    }

    this.logger.log('Generating master BIP32 keys');

    const mnemonic = generateMnemonic();

    const seed = mnemonicToSeedSync(mnemonic);

    const { privateKey, publicKey } = HDKEY.fromMasterSeed(seed);

    await this.secretsEngineService.setEncryptionKeys({
      privateMasterKey: privateKey.toString('hex'),
      publicMasterKey: publicKey.toString('hex'),
      createdAt: moment().format('YYYYMMDD'),
      privateDerivedKey: null,
    });

    await this.deriveKeys();
  }

  public async deriveKeys() {
    this.logger.log('Deriving keys');

    const keys = await this.secretsEngineService.getEncryptionKeys();

    if (!keys) {
      this.logger.log('No secrets found');

      return;
    }

    const { createdAt, privateMasterKey, publicMasterKey } = keys;

    const iteration = moment().diff(createdAt, 'days');

    if (iteration === 0 && privateMasterKey != null) {
      this.logger.log('No need to ');
    }

    const masterSeed = HDKEY.fromMasterSeed(
      Buffer.from(privateMasterKey, 'hex')
    );

    this.logger.log(`KDF iteration ${iteration}`);

    const { privateKey, publicKey } = masterSeed.derive(
      `m/44' /246' /0' /${iteration}`
    );

    await this.iamService.setVerificationMethod(publicKey.toString('hex'));

    await this.secretsEngineService.setEncryptionKeys({
      createdAt,
      privateDerivedKey: privateKey.toString('hex'),
      publicMasterKey,
      privateMasterKey,
    });
  }
}
