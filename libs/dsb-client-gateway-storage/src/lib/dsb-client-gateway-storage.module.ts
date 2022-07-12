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
} from './module';
import { ConfigService } from '@nestjs/config';

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
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'better-sqlite3',
          database: configService.get<string>('DB_NAME', 'local.db'),
          synchronize: true,
          entities: ENTITIES,
          prepareDatabase: (db) => {
            console.log(db);
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DsbClientGatewayStorageModule {}
