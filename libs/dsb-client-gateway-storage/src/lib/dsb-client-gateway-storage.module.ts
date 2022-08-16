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
  IterationEntity,
  KeyEntity,
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
  KeyEntity,
  IterationEntity,
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
            synchronize: true,
            entities: ENTITIES,
          };
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class DsbClientGatewayStorageModule {}
