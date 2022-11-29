import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('association_key')
export class AssociationKeyEntity {
  @PrimaryColumn()
  public associationKey: string;

  @Column()
  public validTo: Date;

  @Column()
  public validFrom: Date;

  @Column()
  public isSent: boolean;

  @Column({
    nullable: true,
  })
  public sentDate: Date | null;

  @Column()
  public iteration: string;

  @Column()
  public owner: string;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;
}
