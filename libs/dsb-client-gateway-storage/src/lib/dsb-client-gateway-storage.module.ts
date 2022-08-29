import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ApplicationEntity,
  ChannelEntity,
  CronEntity,
  DidEntity,
  EnrolmentEntity,
  EventsEntity,
  FileMetadataEntity,
  IdentityEntity,
  SymmetricKeysEntity,
  TopicEntity,
  AcksEntity
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
  AcksEntity
  TopicMonitorEntity,
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        if (configService.get('DB_DRIVER') === 'postgres') {
          return {
            type: 'postgres',
            url: configService.get<string>('DB_NAME', 'local.db'),
            synchronize: true,
            entities: ENTITIES,
          };
        } else {
          return {
            type: 'better-sqlite3',
            database: configService.get<string>('DB_NAME', 'local.db'),
            synchronize: false,
            entities: ENTITIES,
          };
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class DsbClientGatewayStorageModule {}
