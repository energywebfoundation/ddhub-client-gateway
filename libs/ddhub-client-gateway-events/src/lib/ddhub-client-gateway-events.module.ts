import { Module } from '@nestjs/common';
import { EventsService } from './service';
import { EventsRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { CqrsModule } from '@nestjs/cqrs';
import { TriggerEventHandler } from './handler/trigger-event.handler';

@Module({
  imports: [EventsRepositoryModule, CqrsModule],
  providers: [EventsService, TriggerEventHandler],
  exports: [EventsService],
})
export class DdhubClientGatewayEventsModule {}
