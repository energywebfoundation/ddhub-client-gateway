import { Module } from '@nestjs/common';
import { MessageFactoryService } from './service/message-factory.service';
import { RsaService } from './service/rsa.service';
import {
  FileMetadataRepositoryModule,
  TopicRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { DdhubClientGatewayEncryptionModule } from '@dsb-client-gateway/ddhub-client-gateway-encryption';
import { FileHelperService } from './service/file-helper.service';
import { SignatureService } from './service/signature.service';
import { SymmetricKeysService } from './service/symmetric-keys.service';

@Module({
  imports: [
    TopicRepositoryModule,
    DdhubClientGatewayMessageBrokerModule,
    FileMetadataRepositoryModule,
    SecretsEngineModule,
    DdhubClientGatewayEncryptionModule,
  ],
  providers: [
    MessageFactoryService,
    RsaService,
    FileHelperService,
    SignatureService,
    SymmetricKeysService,
  ],
  exports: [MessageFactoryService, RsaService],
})
export class DdhubClientGatewayMessagingModule {}
