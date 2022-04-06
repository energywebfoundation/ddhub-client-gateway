import { Module } from '@nestjs/common';
import { Provider } from './service/provider';
import { DidRegistryListenerService } from './service/did-registry-listener.service';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [],
  providers: [Provider, DidRegistryListenerService],
  exports: [DidRegistryListenerService],
})
export class DidRegistryModule {}
