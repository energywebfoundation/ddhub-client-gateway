import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PrimaryKey } from '@mikro-orm/core';

@Entity('clients')
export class ClientEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @PrimaryKey()
  public clientId: string;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;
}
