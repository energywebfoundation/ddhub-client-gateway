import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ReceivedMessageEntity,
  ReceivedMessageMappingEntity,
  ReceivedMessageReadStatusEntity,
  SentMessageEntity,
  SentMessageRecipientEntity,
} from './entity';
import {
  ReceivedMessageMappingRepository,
  ReceivedMessageReadStatusRepository,
  ReceivedMessageRepository,
  SentMessageRecipientRepository,
  SentMessageRepository,
} from './repository';
import {
  ReceivedMessageReadStatusRepositoryWrapper,
  ReceivedMessageRepositoryWrapper,
  SentMessageRecipientRepositoryWrapper,
  SentMessageRepositoryWrapper,
} from './wrapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReceivedMessageEntity,
      ReceivedMessageRepository,
      ReceivedMessageMappingEntity,
      ReceivedMessageMappingRepository,
      ReceivedMessageReadStatusEntity,
      ReceivedMessageReadStatusRepository,
      SentMessageEntity,
      SentMessageRepository,
      SentMessageRecipientEntity,
      SentMessageRecipientRepository,
    ]),
  ],
  providers: [
    ReceivedMessageReadStatusRepositoryWrapper,
    SentMessageRecipientRepositoryWrapper,
    SentMessageRepositoryWrapper,
    ReceivedMessageRepositoryWrapper,
    ReceivedMessageReadStatusRepositoryWrapper,
  ],
  exports: [
    ReceivedMessageReadStatusRepositoryWrapper,
    SentMessageRecipientRepositoryWrapper,
    SentMessageRepositoryWrapper,
    ReceivedMessageRepositoryWrapper,
    ReceivedMessageReadStatusRepositoryWrapper,
  ],
})
export class MessagesRepositoryModule {}
