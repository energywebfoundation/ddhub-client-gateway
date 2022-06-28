import { Global, Module } from '@nestjs/common';
import { IamFactoryService } from './service/iam-factory.service';
import { IamService } from './service/iam.service';
import { Provider } from '../../../dsb-client-gateway-did-registry/src/lib/service/provider';
import { DdhubClientGatewayUtilsModule } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { InitIamHandler } from './handler/init-iam.handler';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';

@Global()
@Module({
  imports: [DdhubClientGatewayUtilsModule, SecretsEngineModule],
  providers: [IamFactoryService, IamService, Provider, InitIamHandler],
  exports: [IamService],
})
export class IamModule {}
