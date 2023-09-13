import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TopicEntity } from '../../topic';

@Entity('sent_messages')
export class SentMessageEntity {
  @PrimaryColumn()
  clientGatewayMessageId: string;

  @Column({ nullable: true })
  initiatingMessageId?: string;

  @Column({ nullable: true })
  initiatingTransactionId?: string;

  @Column({ nullable: false })
  topicId: string;

  @Column()
  topicVersion: string;

  @Column({ nullable: true })
  transactionId: string;

  @Column()
  signature: string;

  @Column({ default: false })
  payloadEncryption: boolean;

  @Column({ type: 'text' })
  payload: string;

  @Column()
  timestampNanos: Date;

  @Column()
  senderDid: string;

  @Column({ default: false })
  isFile: boolean;

  @Column()
  totalRecipients: number;

  @Column()
  totalSent: number;

  @Column()
  totalFailed: number;

  @Column({ default: () => 'CURRENT_DATE' })
  createdDate: Date;

  @Column({ default: () => 'CURRENT_DATE' })
  updatedDate: Date;
}
