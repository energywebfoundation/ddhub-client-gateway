import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SchemaType } from '../../../topic/topic.const';
import { EncryptionStatus } from '../../message.const';

/**
 * Shared Swagger texts for the processing statuses of a received message.
 * Exported so the offline (stored) message DTOs can reuse them.
 */
export const SIGNATURE_VALID_DESCRIPTION = [
  'Whether the message really comes from the sender:',
  '- `SUCCESS`: yes.',
  '- `FAILED`: no; do not trust the message. It is not decrypted.',
  '- `NOT_REQUIRED`: not checked (file notifications, anonymous external channels).',
  '- `NOT_PERFORMED`: not checked, because the topic is unknown to this gateway.',
  '- `ERROR`: the message could not be processed; see `decryption.errorMessage`.',
  '- `REQUIRED_NOT_PERFORMED`: not used.',
].join('\n');

export const DECRYPTION_STATUS_DESCRIPTION = [
  'Result of decrypting the payload:',
  '- `SUCCESS`: decrypted.',
  '- `NOT_REQUIRED`: was not encrypted.',
  '- `NOT_PERFORMED`: not decrypted, because the signature check failed or the topic is unknown; `payload` is still encrypted.',
  '- `ERROR`: could not be decrypted; see `errorMessage`. Usually the key has not arrived yet; try again later.',
  '- `FAILED`, `REQUIRED_NOT_PERFORMED`: not used.',
].join('\n');

export const DECRYPTION_SCHEMA = {
  type: 'object' as const,
  properties: {
    status: {
      type: 'string' as const,
      enum: Object.values(EncryptionStatus),
      description: `${DECRYPTION_STATUS_DESCRIPTION}

Always present.`,
      example: EncryptionStatus.SUCCESS,
    },
    errorMessage: {
      type: 'string' as const,
      description:
        'Reason of the failure, only present when `status` is `ERROR`.',
      example:
        'did:ethr:volta:0x03830466Ce257f9B798B0f27359D7639dFB6457D:0b271eb8-1e21-4817-95af-7951649360ed does not have symmetric key',
    },
  },
};

/**
 * Item of `GET /messages` (live pull from the message broker).
 */
export class GetMessagesResponseDto {
  @IsString()
  @ApiProperty({
    description: 'Message ID. Use it to mark the message as read, or as `initiatingMessageId` when replying.',
    type: String,
    example: '657a1f0c2b3e4d5f6a7b8c9d',
  })
  id: string;

  @IsString()
  @ApiProperty({
    description: 'Topic name. Empty when the topic is unknown to this gateway.',
    type: String,
    example: 'getOperatingEnvelope',
  })
  topicName: string;

  @IsString()
  @ApiProperty({
    description: 'Application namespace that owns the topic. Empty when the topic is unknown to this gateway.',
    type: String,
    example: 'ddhub.apps.energyweb.iam.ewc',
  })
  topicOwner: string;

  @IsString()
  @ApiProperty({
    description: 'Topic version the sender used.',
    type: String,
    example: '1.0.0',
  })
  topicVersion: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(SchemaType)
  @ApiProperty({
    description: [
      'Type of the payload:',
      '- `JSD7`: JSON, as a string.',
      '- `XSD6`, `XML`: XML.',
      '- `CSV`, `TSV`: comma or tab separated values.',
      '- Empty when the topic is unknown to this gateway.',
    ].join('\n'),
    type: String,
    enum: [
      SchemaType.JSD7,
      SchemaType.XML,
      SchemaType.XSD6,
      SchemaType.CSV,
      SchemaType.TSV,
    ],
    example: 'JSD7',
  })
  topicSchemaType: SchemaType;

  @IsString()
  @ApiProperty({
    description: [
      'The message content.',
      '- Decrypted when it was encrypted (see `decryption`).',
      '- Still encrypted when `decryption.status` is `NOT_PERFORMED` or `ERROR`.',
      '- On a `download` channel: a file notification with the `fileId`.',
    ].join('\n'),
    type: String,
    example: '{"siteId":"NMI-0001","limitKw":49.5,"validFrom":"2024-03-31T10:00:00Z"}',
  })
  payload: string;

  @IsString()
  @ApiProperty({
    description:
      "Sender's signature (hex) over the transmitted payload, created with the sender gateway key. See `signatureValid` for the check result.",
    type: String,
    example:
      '0x0abc6026b01856a756de47ec6f44d9c14fe69009bbf3b9b6cf522d8d783a1c654425848381affca5dab9284d8715fa2f9e34155374bafd923d75c219496cbe161c',
  })
  signature: string;

  @IsString()
  @ApiProperty({
    description: 'DID of the sending gateway.',
    type: String,
    example: 'did:ethr:volta:0x03830466Ce257f9B798B0f27359D7639dFB6457D',
  })
  sender: string;

  @IsNumber()
  @ApiProperty({
    description:
      'Message broker timestamp of the message, in nanoseconds since the Unix epoch.',
    type: Number,
    example: 1711878524357000000,
  })
  timestampNanos: number;

  @ApiProperty({
    description: '`timestampNanos` as an ISO 8601 date-time.',
    type: String,
    format: 'date-time',
    example: '2024-03-31T09:48:44.357Z',
  })
  timestampISO: string;

  @IsString()
  @ApiProperty({
    description: 'Transaction ID set by the sender. Use it as `initiatingTransactionId` when replying.',
    type: String,
    example: '45d5a89f-7c2c-48b0-ae9a-54f4128e818f',
  })
  transactionId: string;

  @ApiProperty({
    description:
      'Message ID of the message this one replies to, as set by the sender. Absent for messages that are not replies.',
    type: String,
    required: false,
    example: '657a1f0c2b3e4d5f6a7b8c9c',
  })
  initiatingMessageId?: string;

  @ApiProperty({
    description:
      'Transaction ID of the conversation this message replies to, as set by the sender. Absent for messages that are not replies.',
    type: String,
    required: false,
    example: '8ac55aa7-7d6d-438a-98bd-376079903c7b',
  })
  initiatingTransactionId?: string;

  @ApiProperty({
    description:
      'Whether the sender encrypted the payload (the sending channel had `payloadEncryption` enabled).',
    type: Boolean,
    example: true,
  })
  payloadEncryption: boolean;

  @ApiProperty({
    description:
      'UUID generated by the sending gateway for this send request. It is the same for all recipients of the message.',
    type: String,
    format: 'uuid',
    example: '0b271eb8-1e21-4817-95af-7951649360ed',
  })
  clientGatewayMessageId: string;

  @ApiProperty({
    description: 'Message broker ID of the topic.',
    type: String,
    example: '62545547fe37f174d7715ff3',
  })
  topicId: string;

  @IsEnum(EncryptionStatus)
  @ApiProperty({
    description: SIGNATURE_VALID_DESCRIPTION,
    enum: EncryptionStatus,
    example: EncryptionStatus.SUCCESS,
  })
  signatureValid: EncryptionStatus;

  @ApiProperty({
    description: 'Decryption result for this message.',
    ...DECRYPTION_SCHEMA,
  })
  decryption: {
    status: EncryptionStatus;
    errorMessage?: string;
  };

  @IsNumber()
  @ApiProperty({
    description: 'Not used here.',
    type: Number,
    example: 5,
    required: false,
  })
  relatedMessagesCount?: number;
}
