import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TopicEntity } from '../../topic/entity/topic.entity';

@Entity('received_messages')
export class ReceivedMessageEntity {
  @PrimaryColumn()
  messageId: string;

  @Column({ nullable: true })
  initiatingMessageId: string;

  @Column()
  clientGatewayMessageId: string;

  @ManyToOne(() => TopicEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'topicId' })
  topic: TopicEntity;

  @Column()
  topicVersion: string;

  @Column({ nullable: true })
  transactionId: string;

  @Column()
  signature: string;

  @Column()
  senderDid: string;

  @Column({ default: false })
  payloadEncryption: boolean;

  @Column()
  payload: string;

  @Column()
  timestampNanos: Date;

  @Column({ default: false })
  isFile: boolean;

  @Column({ default: () => 'CURRENT_DATE' })
  createdDate: Date;

  @Column({ default: () => 'CURRENT_DATE' })
  updatedDate: Date;
}
