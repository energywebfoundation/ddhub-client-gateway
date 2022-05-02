import { IsString } from 'class-validator';
import {
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
  publicRSAKey: string;

  @IsString()
  publicSignatureKey: string;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;
}
