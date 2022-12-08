import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AcksEntity,
  ApplicationEntity,
  AssociationKeyEntity,
  ChannelEntity,
  ClientEntity,
  CronEntity,
  DidEntity,
  EnrolmentEntity,
  EventsEntity,
  FileMetadataEntity,
  IdentityEntity,
  PendingAcksEntity,
  ReqLockEntity,
  SymmetricKeysEntity,
  TopicEntity,
  TopicMonitorEntity,
} from './module';
import { ConfigService } from '@nestjs/config';

const ENTITIES = [
  ClientEntity,
  ChannelEntity,
  IdentityEntity,
  EnrolmentEntity,
  TopicEntity,
  SymmetricKeysEntity,
  DidEntity,
  CronEntity,
  ApplicationEntity,
  FileMetadataEntity,
  EventsEntity,
  AcksEntity,
  PendingAcksEntity,
  TopicMonitorEntity,
  ReqLockEntity,
  AssociationKeyEntity,
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          url: configService.get<string>('DB_NAME', 'local.db'),
          synchronize: configService.get<boolean>('DB_SYNC', false),
          entities: ENTITIES,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DsbClientGatewayStorageModule {}
