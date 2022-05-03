import { Module } from '@nestjs/common';
import { DidRegistryModule } from '@dsb-client-gateway/dsb-client-gateway-did-registry';
import { DidAttributeChangedHandler } from './handler/did-attribute-changed.handler';
import { DidListenerService } from './service/did-listener.service';
import {
  ChannelRepositoryModule,
  DidRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';

@Module({
  imports: [DidRegistryModule, DidRepositoryModule, ChannelRepositoryModule],
  providers: [DidAttributeChangedHandler, DidListenerService],
})
export class DidModule {}
