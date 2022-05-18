import { IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('dids')
export class DidEntity {
  @IsString()
  @PrimaryColumn()
  did: string;

  @IsString()
  @Column({
    default: null,
  })
  publicRSAKey: string;

  @IsString()
  @Column({
    default: null,
  })
  publicSignatureKey: string;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;
}
