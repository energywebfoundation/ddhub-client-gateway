import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('sent_messages_recipients')
export class SentMessageRecipientEntity {
  @PrimaryColumn()
  messageId: string;

  @PrimaryColumn()
  recipientDid: string;

  @Column()
  status: string;

  @Column()
  clientGatewayMessageId: string;

  @Column()
  statusCode: number;

  @Column({ default: () => 'CURRENT_DATE' })
  createdDate: Date;

  @Column({ default: () => 'CURRENT_DATE' })
  updatedDate: Date;
}
