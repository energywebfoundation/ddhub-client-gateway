import {
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('req_lock')
export class ReqLockEntity {
  @PrimaryColumn()
  public clientId: string;

  @PrimaryColumn()
  public fqcn: string;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;
}
