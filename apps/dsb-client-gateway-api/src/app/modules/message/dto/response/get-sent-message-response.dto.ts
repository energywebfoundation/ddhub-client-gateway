import { ApiProperty } from '@nestjs/swagger';

export class GetSentMessageRecipientsResponseDto {
  @ApiProperty({
    description: 'Recipient did',
    type: String,
    example: 'did:ethr:volta:0x782aB0383Bfc807439d8EE29516937B47815d697',
  })
  did: string;

  @ApiProperty({
    description: 'Status',
    example: false,
    type: Boolean,
  })
  failed: boolean;

  @ApiProperty({
    description: 'Message id',
    example: '507f191e810c19729de860ea',
    type: String,
  })
  messageId: string;
}

export class GetSentMessageResponseDto {
  @ApiProperty({
    type: String,
    example: 'f923afb7-e334-419c-a72c-a60b293184ea',
    description: 'Client gateway generated message id',
  })
  clientGatewayMessageId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '507f191e810c19729de860ea',
    description: 'Initating message id',
  })
  initiatingMessageId?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'f923afb7-e334-419c-a72c-a60b293184ea',
    description: 'Initating transaction id',
  })
  initiatingTransactionId?: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '507f191e810c19729de860ea',
    description: 'Topic ID',
  })
  topicId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'getOperatingEnvelope',
    description: 'topic name',
  })
  topicName: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'torta.apps.eggplant.vege.iam.ewc',
    description: 'application namespace',
  })
  topicOwner: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '0.0.1',
    description: 'Topic version',
  })
  topicVersion: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'f923afb7-e334-419c-a72c-a60b293184ea',
    description: 'Transaction ID',
  })
  transactionId: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Generated signature',
  })
  signature: string;

  @ApiProperty({
    type: Boolean,
    required: true,
    example: false,
    description: 'Was payload encrypted',
  })
  payloadEncryption: boolean;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Sent payload',
  })
  payload: string;

  @ApiProperty({
    description: 'timestamp in nano seconds',
    type: Number,
    example: 1649147198388,
  })
  timestampNanos: number;

  @ApiProperty({
    description: 'timestamp formatted in ISO',
    type: String,
    example: '2023-11-19T16:00:00.000Z',
  })
  timestampISO: string;

  @ApiProperty({
    type: String,
    example: 'did:ethr:volta:0x782aB0383Bfc807439d8EE29516937B47815d697',
    description: 'Sender DID',
  })
  senderDid: string;

  @ApiProperty({
    type: String,
    example: 'channel.name',
    description: 'Channel name',
  })
  fqcn: string;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Related messages count',
  })
  relatedMessagesCount: number;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Is file',
  })
  isFile: boolean;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Total amount of recipients',
  })
  totalRecipients: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Total sent messages',
  })
  totalSent: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Total failed messages',
  })
  totalFailed: number;

  @ApiProperty({
    description: 'When application got stored in cache',
    type: String,
    example: '2022-05-18T11:19:07.000Z',
  })
  createdDate: Date;

  @ApiProperty({
    description: 'When application got stored in cache',
    type: String,
    example: '2022-05-18T11:19:07.000Z',
  })
  updatedDate: Date;

  @ApiProperty({
    type: String,
    required: false,
    example: ['507f191e810c19729de860ea'],
    description: 'Message id',
    isArray: true,
  })
  messagesIds: string[];

  @ApiProperty({
    isArray: true,
    type: GetSentMessageRecipientsResponseDto,
  })
  recipients: GetSentMessageRecipientsResponseDto[];
}
