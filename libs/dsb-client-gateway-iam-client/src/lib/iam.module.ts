import { Global, Module } from '@nestjs/common';
import { IamFactoryService } from './service/iam-factory.service';
import { IamService } from './service/iam.service';
import { Provider } from '../../../dsb-client-gateway-did-registry/src/lib/service/provider';
import { DdhubClientGatewayUtilsModule } from '@dsb-client-gateway/ddhub-client-gateway-utils';

@Global()
@Module({
  imports: [DdhubClientGatewayUtilsModule],
  providers: [IamFactoryService, IamService, Provider],
  exports: [IamService],
})
export class IamModule {}
