import { Module } from '@nestjs/common';
import { LokiService } from './service';
import { DidRepository } from './repository/did.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ChannelEntity,
  EnrolmentEntity,
  IdentityEntity,
  SymmetricKeysEntity,
  TopicEntity,
} from './module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: './test1.db',
      synchronize: true,
      entities: [
        ChannelEntity,
        IdentityEntity,
        EnrolmentEntity,
        TopicEntity,
        SymmetricKeysEntity,
      ],
    }),
  ],
  controllers: [],
  providers: [LokiService, DidRepository],
  exports: [LokiService, DidRepository],
})
export class DsbClientGatewayStorageModule {}
