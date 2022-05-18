import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ApplicationEntity,
  ChannelEntity,
  CronEntity,
  DidEntity,
  EnrolmentEntity,
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
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DsbClientGatewayStorageModule {}
