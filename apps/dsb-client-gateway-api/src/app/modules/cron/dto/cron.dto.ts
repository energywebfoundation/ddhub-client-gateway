import {
  CronEntity,
  CronJobType,
  CronStatus,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ApiProperty } from '@nestjs/swagger';

export class CronResponseDto implements CronEntity {
  @ApiProperty({
    description: 'Date when CRON job started to run',
    type: String,
    example: '2022-05-15T11:50:02.000Z',
  })
  createdDate: Date;

  @ApiProperty({
    description: 'Date when cron job finished execution',
    example: '2022-05-15T12:03:09.236Z',
    type: String,
  })
  executedAt: Date;

  @ApiProperty({
    description: 'CRON job name',
    example: CronJobType.DID_LISTENER,
    enum: CronJobType,
    type: String,
  })
  jobName: CronJobType;

  @ApiProperty({
    description: 'CRON job status',
    example: CronStatus.FAILED,
    enum: CronStatus,
    type: String,
  })
  latestStatus: CronStatus;

  @ApiProperty({
    description:
      'Date when CRON job was updated (it will usually match executedAt)',
    example: '2022-05-15T12:03:09.000Z',
    type: String,
  })
  updatedDate: Date;
}
