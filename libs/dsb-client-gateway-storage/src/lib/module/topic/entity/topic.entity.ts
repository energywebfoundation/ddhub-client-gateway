import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('topic')
export class TopicEntity {
  @PrimaryColumn()
  id: string;

  @PrimaryColumn()
  name: string;

  @PrimaryColumn()
  schemaType: string;

  @Column({
    type: 'text',
    transformer: {
      to(value: any): any {
        return JSON.stringify(value);
      },
      from(value: any): any {
        return JSON.parse(value);
      },
    },
  })
  schema: object;

  @Column({
    type: 'text',
    transformer: {
      to(value: any): any {
        return JSON.stringify(value);
      },
      from(value: any): any {
        return JSON.parse(value);
      },
    },
  })
  tags: string[];

  @Column()
  owner: string;

  @Column({
    nullable: true,
  })
  majorVersion: string;

  @Column({
    nullable: true,
  })
  minorVersion: string;

  @Column({
    nullable: true,
  })
  patchVersion: string;

  @PrimaryColumn()
  version: string;

  @CreateDateColumn()
  createdDate?: Date;

  @UpdateDateColumn()
  updatedDate?: Date;
}
