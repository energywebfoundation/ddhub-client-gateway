import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TopicEntity } from '@dsb-client-gateway/dsb-client-gateway-storage';

@Entity('sent_messages')
export class SentMessageEntity {
  @PrimaryColumn()
  clientGatewayMessageId: string;

  @Column({ nullable: true })
  initiatingMessageId?: string;

  @Column({ nullable: true })
  initiatingTransactionId?: string;

  @ManyToOne(() => TopicEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'topicId' })
  topic: TopicEntity;

  @Column()
  topicVersion: string;

  @Column({ nullable: true })
  transactionId: string;

  @Column()
  signature: string;

  @Column({ default: false })
  payloadEncryption: boolean;

  @Column()
  payload: string;

  @Column()
  timestampNanos: Date;

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
