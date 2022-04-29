import { Module } from '@nestjs/common';
import { DidRegistryModule } from '@dsb-client-gateway/dsb-client-gateway-did-registry';
import { DidAttributeChangedHandler } from './handler/did-attribute-changed.handler';
import { DidListenerService } from './service/did-listener.service';
import { DidRepositoryModule } from '../../../../../../libs/dsb-client-gateway-storage/src/lib/module/did';

@Module({
  imports: [DidRegistryModule, DidRepositoryModule],
  providers: [DidAttributeChangedHandler, DidListenerService],
})
export class DidModule {}
