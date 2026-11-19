import { ApiProperty } from '@nestjs/swagger';

export class GetSentMessageRecipientsResponseDto {
  @ApiProperty({
    description: 'DID of the recipient gateway.',
    type: String,
    example: 'did:ethr:volta:0x782aB0383Bfc807439d8EE29516937B47815d697',
  })
  did: string;

  @ApiProperty({
    description:
      'Name of the recipient in the local address book. Absent when the DID has no address book entry.',
    type: String,
    required: false,
    example: 'Distribution Network Operator A',
  })
  alias?: string;

  @ApiProperty({
    description:
      '`true` when the message broker did not report status code `200` for this recipient.',
    example: false,
    type: Boolean,
  })
  failed: boolean;

  @ApiProperty({
    description: 'Message ID of the copy for this recipient. Replies from this recipient use it as `initiatingMessageId`.',
    example: '657a1f0c2b3e4d5f6a7b8c9d',
    type: String,
  })
  messageId: string;
}

/**
 * Item of `GET /messages/sent`: a message or file this gateway sent through a
 * channel with message forms enabled, read from the local store.
 */
export class GetSentMessageResponseDto {
  @ApiProperty({
    type: String,
    format: 'uuid',
    example: 'f923afb7-e334-419c-a72c-a60b293184ea',
    description: 'ID of the send request (UUID).',
  })
  clientGatewayMessageId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '657a1f0c2b3e4d5f6a7b8c9c',
    description:
      'Message ID of the received message this message replied to. Absent when it was not a reply; always absent for files.',
  })
  initiatingMessageId?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '8ac55aa7-7d6d-438a-98bd-376079903c7b',
    description:
      'Transaction ID of the conversation this message replied to. Absent when it was not a reply; always absent for files.',
  })
  initiatingTransactionId?: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '62545547fe37f174d7715ff3',
    description: 'Message broker ID of the topic.',
  })
  topicId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'getOperatingEnvelope',
    description: 'Topic name.',
  })
  topicName: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'ddhub.apps.energyweb.iam.ewc',
    description: 'Application namespace that owns the topic.',
  })
  topicOwner: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '1.0.0',
    description: 'Topic version the message was sent with.',
  })
  topicVersion: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '45d5a89f-7c2c-48b0-ae9a-54f4128e818f',
    description:
      'Transaction ID given by the caller when sending, if any.',
  })
  transactionId: string;

  @ApiProperty({
    type: String,
    required: true,
    example:
      '0x0abc6026b01856a756de47ec6f44d9c14fe69009bbf3b9b6cf522d8d783a1c654425848381affca5dab9284d8715fa2f9e34155374bafd923d75c219496cbe161c',
    description:
      'Signature this gateway added to the message or file.',
  })
  signature: string;

  @ApiProperty({
    type: Boolean,
    required: true,
    example: true,
    description:
      'Whether the payload or file was encrypted in transit (the channel had `payloadEncryption` enabled and was not an anonymous external channel).',
  })
  payloadEncryption: boolean;

  @ApiProperty({
    type: String,
    required: true,
    example: '{"siteId":"NMI-0001","limitKw":49.5,"validFrom":"2024-03-31T10:00:00Z"}',
    description: 'The original payload. Empty for files.',
  })
  payload: string;

  @ApiProperty({
    description:
      'Send time in nanoseconds since the Unix epoch (millisecond precision, recorded by this gateway).',
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

  @ApiProperty({
    type: String,
    example: 'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
    description: 'DID of this gateway at the time of sending.',
  })
  senderDid: string;

  @ApiProperty({
    type: String,
    example: 'ddhub.apps.energyweb.channel.operating.envelope',
    description: 'FQCN of the channel the message was sent through.',
  })
  fqcn: string;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Number of received replies to this message.',
  })
  relatedMessagesCount: number;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: '`true` for a file, `false` for a message.',
  })
  isFile: boolean;

  @ApiProperty({
    type: Number,
    example: 3,
    description:
      'Number of recipients the message broker reported for the send request (`recipients.total` of the send response).',
  })
  totalRecipients: number;

  @ApiProperty({
    type: Number,
    example: 2,
    description:
      'Number of recipients the message was delivered to (`recipients.sent` of the send response).',
  })
  totalSent: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description:
      'Number of recipients the delivery failed for (`recipients.failed` of the send response).',
  })
  totalFailed: number;

  @ApiProperty({
    description: 'When this gateway stored the message.',
    type: String,
    format: 'date-time',
    example: '2024-03-31T09:48:44.400Z',
  })
  createdDate: Date;

  @ApiProperty({
    description: 'When the stored record was last updated.',
    type: String,
    format: 'date-time',
    example: '2024-03-31T09:48:44.400Z',
  })
  updatedDate: Date;

  @ApiProperty({
    type: String,
    required: false,
    example: ['657a1f0c2b3e4d5f6a7b8c9d', '657a1f0c2b3e4d5f6a7b8c9e'],
    description:
      'A list of message IDs, one for each recipient the message was sent to.',
    isArray: true,
  })
  messagesIds: string[];

  @ApiProperty({
    isArray: true,
    type: GetSentMessageRecipientsResponseDto,
    description:
      'A list of delivery results, one for each recipient the message was delivered to.',
  })
  recipients: GetSentMessageRecipientsResponseDto[];
}
