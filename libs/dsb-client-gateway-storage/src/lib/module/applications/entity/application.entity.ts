import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('applications')
export class ApplicationEntity {
  @PrimaryColumn()
  public appName: string;

  @Column({
    nullable: true,
  })
  public logoUrl: string | null;

  @Column({
    nullable: true,
  })
  public websiteUrl: string | null;

  @Column({
    nullable: true,
  })
  public description: string | null;

  @Column({
    nullable: true,
  })
  public namespace: string | null;

  @Column({
    nullable: true,
  })
  public topicsCount: number | null;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;
}
