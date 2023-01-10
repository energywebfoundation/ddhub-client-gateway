import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('acks')
export class AcksEntity {
  @PrimaryColumn()
  public messageId: string;

  @PrimaryColumn()
  public clientId: string;

  @Column()
  public mbTimestamp!: Date;

  @CreateDateColumn()
  createdDate?: Date;
}
