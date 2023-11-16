import { Module } from '@nestjs/common';
import { CleanupHandler } from './handler';
import {
  AcksRepositoryModule,
  AddressBookRepositoryModule,
  ApplicationRepositoryModule,
  AssociationKeysRepositoryModule,
  ChannelRepositoryModule,
  ClientRepositoryModule,
  CronRepositoryModule,
  DidRepositoryModule,
  EventsRepositoryModule,
  FileMetadataRepositoryModule,
  MessagesRepositoryModule,
  SymmetricKeysRepositoryModule,
  TopicMonitorRepositoryModule,
  TopicRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';

@Module({
  imports: [
    AcksRepositoryModule,
    AddressBookRepositoryModule,
    ApplicationRepositoryModule,
    AssociationKeysRepositoryModule,
    ChannelRepositoryModule,
    ClientRepositoryModule,
    CronRepositoryModule,
    EventsRepositoryModule,
    DidRepositoryModule,
    FileMetadataRepositoryModule,
    MessagesRepositoryModule,
    SymmetricKeysRepositoryModule,
    TopicRepositoryModule,
    TopicMonitorRepositoryModule,
  ],
  providers: [CleanupHandler],
  exports: [],
})
export class DdhubClientGatewayCleanupModule {}
