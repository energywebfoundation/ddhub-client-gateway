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

  @CreateDateColumn()
  createdDate!: Date;
}
