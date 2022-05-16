import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CronJobType, CronStatus } from '../cron.const';

@Entity('cron')
export class CronEntity {
  @PrimaryColumn({
    enum: CronJobType,
    type: 'text',
  })
  jobName: CronJobType;

  @Column({
    enum: CronStatus,
    type: 'text',
  })
  latestStatus: CronStatus;

  @Column()
  executedAt: Date;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;
}
