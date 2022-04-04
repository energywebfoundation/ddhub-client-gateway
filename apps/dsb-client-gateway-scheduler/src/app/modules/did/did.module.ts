import { Module } from '@nestjs/common';
import { DidRegistryModule } from '@dsb-client-gateway/dsb-client-gateway-did-registry';
import { DidAttributeChangedHandler } from './handler/did-attribute-changed.handler';
import { DidListenerService } from './service/did-listener.service';

@Module({
  imports: [DidRegistryModule],
  providers: [DidAttributeChangedHandler, DidListenerService],
})
export class DidModule {}
