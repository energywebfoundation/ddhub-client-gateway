import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AcksEntity,
  ApplicationEntity,
  ChannelEntity,
  CronEntity,
  DidEntity,
  EnrolmentEntity,
  EventsEntity,
  FileMetadataEntity,
  IdentityEntity,
  ReqLockEntity,
  SymmetricKeysEntity,
  TopicEntity,
} from './module';
import { ConfigService } from '@nestjs/config';
import { TopicMonitorEntity } from './module/topic-monitor';

const ENTITIES = [
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
  TopicMonitorEntity,
  ReqLockEntity,
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
