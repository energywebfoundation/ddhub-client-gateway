import { Injectable, Logger } from '@nestjs/common';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import HDKEY from 'hdkey';
import moment from 'moment';
import { PubKeyType } from '@ew-did-registry/did-resolver-interface';
import { KeyType } from '@ew-did-registry/keys';
import { EcdhTagService, Tag } from './ecdh-tag.service';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { IterationWrapperRepository } from '@dsb-client-gateway/dsb-client-gateway-storage';

@Injectable()
export class ECDHKdfService {
  protected readonly logger = new Logger(ECDHKdfService.name);

  constructor(
    protected readonly iamService: IamService,
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly ecdhTagService: EcdhTagService,
    protected readonly iterationWrapper: IterationWrapperRepository
  ) {}

  public async deriveKey(force = false): Promise<void> {
    if (!this.iamService.isInitialized()) {
      this.logger.warn('not deriving key due to not initialized IAM');
      return;
    }

    const masterSeed: string | null =
      await this.secretsEngineService.getMasterSeed();

    if (!masterSeed) {
      this.logger.warn('Master seed does not exists');

      return;
    }

    const iteration: string = moment().utc().format('YYYYMMDD');
    const existsInDid: boolean = await this.existsInDid(iteration);

    if (existsInDid && !force) {
      this.logger.log(
        `ecdh already has derived key for ${iteration} iterationkey.ent`
      );

      return;
    }

    const hdkey = HDKEY.fromMasterSeed(Buffer.from('masterSeed'));

    hdkey.derive(`m/44' /246' /0' /${iteration}`);

    const tag: Tag = await this.ecdhTagService.createTag(iteration);

    this.logger.log('creating tag', tag);

    const key = hdkey.publicKey.toString('hex');

    await this.iamService.setVerificationMethod(
      key,
      tag.full,
      PubKeyType.VerificationKey2018,
      KeyType.Secp256k1
    );

    await this.secretsEngineService.setKey(
      tag.full,
      hdkey.privateKey.toString('hex')
    );

    await this.iterationWrapper.keyRepository.save({
      iteration: tag.dailyIteration,
      dateUtc: iteration,
    });
  }

  protected async existsInDid(iteration: string): Promise<boolean> {
    const didDocument = await this.iamService.getDid(
      this.iamService.getDIDAddress()
    );

    return (
      this.ecdhTagService.getKeysWithMatchingIteration(didDocument, iteration)
        .length > 0
    );
  }

  public async createMasterSeedIfNotExists(): Promise<void> {
    this.logger.log('creating new seed');

    const mnemonic: string = generateMnemonic();

    const seed: string = mnemonicToSeedSync(mnemonic).toString('hex');

    await this.secretsEngineService.setMasterSeed(seed);
  }
}
