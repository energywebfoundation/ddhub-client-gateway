import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('topic_monitor')
export class TopicMonitorEntity {
  @PrimaryColumn()
  owner: string;

  @Column({
    type: 'timestamptz',
  })
  lastTopicVersionUpdate: Date;

  @Column({
    type: 'timestamptz',
  })
  lastTopicUpdate: Date;

  @CreateDateColumn()
  createdDate?: Date;

  @UpdateDateColumn()
  updatedDate?: Date;
}
