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

  @Column()
  name: string;

  @Column()
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

  @Column()
  version: string;

  @CreateDateColumn()
  createdDate?: Date;

  @UpdateDateColumn()
  updatedDate?: Date;
}
