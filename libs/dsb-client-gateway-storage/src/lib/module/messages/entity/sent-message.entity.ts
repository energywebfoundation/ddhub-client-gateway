import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('sent_messages')
export class SentMessageEntity {
  @PrimaryColumn()
  clientGatewayMessageId: string;

  @Column({ nullable: true })
  initiatingMessageId?: string;

  @Column({
    array: true,
    type: String,
  })
  messageIds: string[];

  @Column({ nullable: true })
  initiatingTransactionId?: string;

  @Column({ nullable: false })
  topicId: string;

  @Column({ nullable: false })
  topicName: string;

  @Column({
    nullable: false,
  })
  topicOwner: string;

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

  @Column()
  senderDid: string;

  @Column()
  fqcn: string;

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
