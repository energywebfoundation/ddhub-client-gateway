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
  public logoUrl?: string | null;

  @Column({
    nullable: true,
  })
  public websiteUrl?: string | null;

  @Column({
    nullable: true,
  })
  public description?: string | null;

  @Column({
    nullable: true,
  })
  public namespace?: string | null;

  @Column({
    nullable: true,
  })
  public topicsCount?: number | null;

  @Column({
    type: 'text',
    transformer: {
      to(value: any): any {
        return JSON.stringify(value);
      },
      from(value: any): any {
        if (Array.isArray(value)) {
          return JSON.stringify(value);
        }

        return JSON.parse(value);
      },
    },
    default: '[]',
  })
  public roles: string[];

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;
}
