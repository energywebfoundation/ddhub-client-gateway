import { generateMnemonic, mnemonicToSeedSync } from 'bip39'
import HDKEY from 'hdkey'

export class KeysService {
  public async generateMasterKeys(): Promise<HDKEY> {
    const mnemonic = generateMnemonic()

    const seed = mnemonicToSeedSync(mnemonic)

    return HDKEY.fromMasterSeed(seed)
  }

  public async deriveKey(publicExtendedKey: string, privateExtendedKey: string, iteration: number) {
    const masterKey = HDKEY.fromJSON({
      xpriv: privateExtendedKey,
      xpub: publicExtendedKey
    })

    const derivedKey = masterKey.derive(`m/44' /246' /0' /${iteration}`)

    return {
      publicKey: derivedKey.publicKey.toString('hex'),
      privateKey: derivedKey.privateKey.toString('hex'),
      xPublicKey: derivedKey.publicExtendedKey,
      xPrivateKey: derivedKey.privateExtendedKey
    }
  }
}
