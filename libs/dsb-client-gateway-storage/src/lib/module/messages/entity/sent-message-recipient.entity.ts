import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SentMessageEntity } from './sent-message.entity';

@Entity('sent_messages_recipients')
export class SentMessageRecipientEntity {
  @PrimaryColumn()
  messageId: string;

  @ManyToOne(() => SentMessageEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientGatewayMessageId' })
  sentMessage: SentMessageEntity;

  @PrimaryColumn()
  recipientDid: string;

  @Column()
  recipientStatus: string;

  @Column()
  recipientStatusCode: number;

  @Column({ default: () => 'CURRENT_DATE' })
  createdDate: Date;

  @Column({ default: () => 'CURRENT_DATE' })
  updatedDate: Date;
}
