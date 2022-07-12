// import { EthersService } from '@dsb-client-gateway/ddhub-client-gateway-utils';
// import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
// import HDKEY from 'hdkey';
// import { EncryptionService } from './encryption.service';
// import { Readable } from 'stream';
// import { DidService } from './did.service';
//
// export class EcdhService extends EncryptionService {
//   protected readonly curve: string = 'secp256k1';
//
//   constructor(
//     protected readonly ethersService: EthersService,
//     protected readonly secretsEngineService: SecretsEngineService,
//     protected readonly didService: DidService
//   ) {
//     super(didService);
//   }
//
//   public async createMasterSeed(): Promise<void> {
//     const hdkey: HDKEY = this.ethersService.generateHDKey();
//
//     await this.secretsEngineService.getRSAPrivateKey();
//   }
//
//   checksumFile(path: string): Promise<string> {
//     return Promise.resolve('');
//   }
//
//   decryptMessageStream(path: string): Promise<Readable> {
//     return Promise.resolve(undefined);
//   }
//
//   encryptMessage(
//     message: string,
//     computedSharedKey: string
//   ): Promise<string> | string {
//     return undefined;
//   }
//
//   encryptMessageStream(
//     readable: Readable,
//     decryptionKey: string,
//     filename: string
//   ) {}
// }
