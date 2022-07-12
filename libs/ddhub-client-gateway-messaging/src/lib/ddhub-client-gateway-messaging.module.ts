import { Module } from '@nestjs/common';
import { MessageFactoryService } from './service/message-factory.service';
import { RsaService } from './service/rsa.service';

@Module({
  providers: [MessageFactoryService, RsaService],
  exports: [MessageFactoryService, RsaService],
})
export class DdhubClientGatewayMessagingModule {}
