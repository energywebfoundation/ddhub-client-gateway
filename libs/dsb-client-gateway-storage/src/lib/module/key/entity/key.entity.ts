import { IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('keys')
export class KeyEntity {
  @IsString()
  @PrimaryColumn()
  did: string;

  @Column()
  tag: string;

  @Column()
  key: string;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;
}
