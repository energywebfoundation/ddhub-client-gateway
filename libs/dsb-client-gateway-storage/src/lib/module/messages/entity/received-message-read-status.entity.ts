import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ReceivedMessageEntity } from './received-message.entity';

@Entity('received_messages_read_status')
export class ReceivedMessageReadStatusEntity {
  @PrimaryColumn()
  messageId: string;

  @PrimaryColumn()
  recipientUser: string;

  @ManyToOne(() => ReceivedMessageEntity)
  @JoinColumn({ name: 'messageId' })
  message: ReceivedMessageEntity;
}
