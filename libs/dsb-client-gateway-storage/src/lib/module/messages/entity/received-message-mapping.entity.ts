import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ReceivedMessageEntity } from './received-message.entity';

@Entity('received_messages_mapping')
export class ReceivedMessageMappingEntity {
  @PrimaryColumn()
  fqcn: string;

  @ManyToOne(() => ReceivedMessageEntity)
  @JoinColumn({ name: 'messageId' })
  message: ReceivedMessageEntity;
}
