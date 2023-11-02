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
  ReceivedMessageMappingRepositoryWrapper,
  ReceivedMessageReadStatusRepositoryWrapper,
  ReceivedMessageRepositoryWrapper,
  SentMessageRecipientRepositoryWrapper,
  SentMessageRepositoryWrapper,
} from './wrapper';
import { AddressBookRepositoryModule } from '../address-book';

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
    ReceivedMessageMappingRepositoryWrapper,
  ],
  exports: [
    ReceivedMessageReadStatusRepositoryWrapper,
    SentMessageRecipientRepositoryWrapper,
    SentMessageRepositoryWrapper,
    ReceivedMessageRepositoryWrapper,
    ReceivedMessageMappingRepositoryWrapper,
  ],
})
export class MessagesRepositoryModule {}
