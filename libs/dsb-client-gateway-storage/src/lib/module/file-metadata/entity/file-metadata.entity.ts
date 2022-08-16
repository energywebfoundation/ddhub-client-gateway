import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('files')
export class FileMetadataEntity {
  @PrimaryColumn()
  public fileId: string;

  @PrimaryColumn()
  public did: string;

  @PrimaryColumn()
  public clientGatewayMessageId: string;

  @PrimaryColumn()
  public signature: string;

  @Column()
  public encrypted: boolean;

  @Column()
  public path: string;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;
}
