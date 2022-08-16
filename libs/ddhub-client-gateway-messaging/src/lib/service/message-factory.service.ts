import { Injectable } from '@nestjs/common';
import { RsaService } from './rsa.service';
import { MessagingType } from '../message.const';
import { RsaEncryptionService } from '@dsb-client-gateway/ddhub-client-gateway-encryption';
import {
  DdhubFilesService,
  DdhubMessagesService,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { ConfigService } from '@nestjs/config';
import { TopicRepositoryWrapper } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { SymmetricKeysService } from './symmetric-keys.service';
import { SignatureService } from './signature.service';
import { FileHelperService } from './file-helper.service';

@Injectable()
export class MessageFactoryService {
  constructor(
    protected readonly rsaEncryptionService: RsaEncryptionService,
    protected readonly ddhubMessageService: DdhubMessagesService,
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly configService: ConfigService,
    protected readonly topicWrapper: TopicRepositoryWrapper,
    protected readonly ddhubFilesService: DdhubFilesService,
    protected readonly fileHelperService: FileHelperService,
    protected readonly symmetricKeysService: SymmetricKeysService,
    protected readonly signatureService: SignatureService
  ) {}

  public create<T extends RsaService>(t: MessagingType): T {
    switch (t) {
      case MessagingType.RSA:
        return new RsaService(
          this.rsaEncryptionService,
          this.ddhubMessageService,
          this.secretsEngineService,
          this.topicWrapper,
          this.configService,
          this.ddhubFilesService,
          this.fileHelperService,
          this.signatureService,
          this.symmetricKeysService
        ) as T;
      default:
        throw new Error(`Invalid messaging type ${t}`);
    }
  }
}
