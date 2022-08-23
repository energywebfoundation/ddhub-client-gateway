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

  @Column()
  lastTopicVersionUpdate: string;

  @Column()
  lastTopicUpdate: string;

  @CreateDateColumn()
  createdDate?: Date;

  @UpdateDateColumn()
  updatedDate?: Date;
}
