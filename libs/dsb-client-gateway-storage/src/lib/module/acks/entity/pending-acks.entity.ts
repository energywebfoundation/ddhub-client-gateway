import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('pending_acks')
export class PendingAcksEntity {
  @PrimaryColumn()
  public messageId: string;

  @PrimaryColumn()
  public clientId: string;

  @Column()
  public mbTimestamp!: Date;

  @CreateDateColumn()
  createdDate?: Date;
}
