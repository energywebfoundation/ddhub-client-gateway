import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('pending_acks')
export class PendingAcksEntity {
  @PrimaryColumn()
  public messageId: string;

  @PrimaryColumn()
  public clientId: string;

  @PrimaryColumn()
  from: string;

  @Column()
  public mbTimestamp!: Date;

  @CreateDateColumn()
  createdDate?: Date;
}
