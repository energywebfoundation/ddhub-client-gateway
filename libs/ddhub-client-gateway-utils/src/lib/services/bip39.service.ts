import { Injectable } from '@nestjs/common';
import * as bip39 from 'bip39';
import HDKEY from 'hdkey';

export interface Bip39KeySet {
  publicKey: string;
  privateKey: string;
  xPublicKey: string;
  xPrivateKey: string;
}

@Injectable()
export class Bip39Service {
  public generateMnemonic(): string {
    return bip39.generateMnemonic();
  }

  public generateMasterHDKey(mnemonic: string) {
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    return HDKEY.fromMasterSeed(seed);
  }

  public deriveKey(
    mnemonic: string,
    firstIteration: number,
    secondIteration: number,
  ): Bip39KeySet {
    const masterKey = this.generateMasterHDKey(mnemonic);

    const derivedKey = masterKey.derive(
      `m/44' /246' /0' /${firstIteration} /${secondIteration}`,
    );

    return {
      publicKey: derivedKey.publicKey.toString('hex'),
      privateKey: derivedKey.privateKey.toString('hex'),
      xPublicKey: derivedKey.publicExtendedKey,
      xPrivateKey: derivedKey.privateExtendedKey,
    };
  }
}
