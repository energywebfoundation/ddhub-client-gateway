import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ChannelEntity,
  EnrolmentEntity,
  IdentityEntity,
  SymmetricKeysEntity,
  TopicEntity,
} from './module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'better-sqlite3',
          database: configService.get<string>('DB_NAME', 'local.db'),
          synchronize: true,
          entities: [
            ChannelEntity,
            IdentityEntity,
            EnrolmentEntity,
            TopicEntity,
            SymmetricKeysEntity,
          ],
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class DsbClientGatewayStorageModule {}
