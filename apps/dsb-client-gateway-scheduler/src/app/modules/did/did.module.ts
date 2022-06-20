import { Module } from '@nestjs/common';
import { DidRegistryModule } from '@dsb-client-gateway/dsb-client-gateway-did-registry';
import { DidAttributeChangedHandler } from './handler/did-attribute-changed.handler';
import { DidListenerService } from './service/did-listener.service';
import {
  ChannelRepositoryModule,
  CronRepositoryModule,
  DidRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ChannelDidService } from './service/channel-did.service';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';

@Module({
  imports: [
    DidRegistryModule,
    DidRepositoryModule,
    ChannelRepositoryModule,
    CronRepositoryModule,
    DdhubClientGatewayMessageBrokerModule,
  ],
  providers: [
    DidAttributeChangedHandler,
    DidListenerService,
    ChannelDidService,
  ],
})
export class DidModule {}
