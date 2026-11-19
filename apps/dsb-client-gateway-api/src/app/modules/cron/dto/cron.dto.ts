import {
  CronEntity,
  CronJobType,
  CronStatus,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ApiProperty } from '@nestjs/swagger';

export class CronResponseDto implements CronEntity {
  @ApiProperty({
    description:
      'When the entry for this job was first created, i.e. the end of its first recorded run (since the last reset of the job history).',
    type: String,
    format: 'date-time',
    example: '2024-05-15T11:50:02.000Z',
  })
  createdDate: Date;

  @ApiProperty({
    description:
      'When the latest run finished and recorded `latestStatus`.',
    type: String,
    format: 'date-time',
    example: '2024-05-15T12:03:09.236Z',
  })
  executedAt: Date;

  @ApiProperty({
    description: [
      'Job identifier. Jobs that report a status here (the settings that control each job in brackets):',
      '- `APPLICATIONS_REFRESH`: refreshes the applications the gateway DID is related to from SSI Hub (`APPLICATION_CRON_*`).',
      '- `TOPIC_REFRESH`: refreshes topics of those applications from the Message Broker (`TOPICS_CRON_*`).',
      '- `CHANNEL_ROLES`: resolves the roles configured on channels into the DIDs that hold them (`CHANNEL_DID_CRON_*`).',
      '- `DID_LISTENER`: picks up key changes of other parties (runs when their DID document changes).',
      '- `SYMMETRIC_KEYS`: fetches the keys needed to decrypt received messages (`SYMMETRIC_KEYS_CRON_*`).',
      '- `ASSOCIATION_KEYS`: generates the current and next association keys and removes old ones (`ASSOCIATION_KEYS_CRON_*`).',
      '- `ROLES_REFRESH`: refreshes the enrolment of the gateway DID and publishes approved claims to the DID document (`ROLES_REFRESH_CRON_*`).',
      '- `PRIVATE_KEY`: detects a change of the stored private key (`PRIVATE_KEY_CRON_*`).',
      '- `CLIENTS`: finds outdated message broker clients and deletes them (`CLIENTS_CRON_*`).',
      '- `FILE_CLEANER`: deletes expired downloaded files (`FILE_CLEANER_CRON_*`).',
      '- `INTERNAL_MESSAGE_CLEANER`: cleans stored messages data (`MESSAGE_CLEANER_CRON_*`).',
      '- `MESSAGES_FETCH`: fetches messages from the Message Broker in the background (`FETCH_MESSAGES_CRON_*`).',
      '- `OFFLINE_MESSAGES_CLEANER`: cleans up stored messages (`CLEANUP_MESSAGES_CRON_*`).',
    ].join('\n'),
    example: CronJobType.ROLES_REFRESH,
    enum: CronJobType,
    type: String,
  })
  jobName: CronJobType;

  @ApiProperty({
    description: [
      'Result of the latest run:',
      '- `SUCCESS`: completed.',
      '- `FAILED`: failed; see the gateway logs.',
    ].join('\n'),
    example: CronStatus.SUCCESS,
    enum: CronStatus,
    type: String,
  })
  latestStatus: CronStatus;

  @ApiProperty({
    description:
      'When the entry was last written (same as `executedAt`).',
    example: '2024-05-15T12:03:09.000Z',
    type: String,
    format: 'date-time',
  })
  updatedDate: Date;
}
