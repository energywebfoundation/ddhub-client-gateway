import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// `Error`, `SendMessageSuccessResponse` and `SendMessageFailedResponse` are not
// referenced by any route and therefore do not appear in the OpenAPI document.
export class Error {
  @ApiProperty({
    description: 'code sent for error',
    type: Number,
    example: 400,
  })
  code: string;

  @ApiProperty({
    description: 'reason for failed message',
    type: String,
    example: 'failed due to',
  })
  reason: string;

  @ApiProperty({
    description: 'Additional Information for failed message',
    type: Object,
    example: {
      instancePath: '/nmis',
      schemaPath: '#/properties/nmis/uniqueItems',
      keyword: 'uniqueItems',
      params: {
        i: 2,
        j: 1,
      },
      message: 'must NOT have duplicate items (items ## 1 and 2 are identical)',
    },
  })
  additionalInformation: object;
}

export class SendMessageSuccessResponse {
  @ApiPropertyOptional({
    description: 'did for which message is sent',
    type: String,
    example: 'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
  })
  did: string;

  @ApiProperty({
    description: 'message id sent by message broker',
    type: String,
    example: '623c875beaa0422bfc19b1ce',
  })
  messageId: string;

  @ApiProperty({
    description: 'message id sent by message broker',
    type: String,
    example: '623c875beaa0422bfc19b1ce',
  })
  @ApiProperty({
    description: 'Status Code sent by message broker',
    type: Number,
    example: 200,
  })
  statusCode: number;
}

export class SendMessageFailedResponse {
  @ApiProperty({
    description: 'did for which message is sent',
    type: String,
    example: 'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
  })
  did: string;

  @ApiProperty({
    description: 'message id sent by message broker',
    type: String,
    example: '623c875beaa0422bfc19b1ce',
  })
  messageId: string;

  @ApiProperty({
    description: 'message id sent by message broker',
    type: String,
    example: '623c875beaa0422bfc19b1ce',
  })
  @ApiProperty({
    description: 'Status Code sent by message broker',
    type: Number,
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Status Code sent by message broker',
    type: Error,
    example: {
      code: 'DSB::INVALID_PAYLOAD',
      reason: 'payload does not match the schema for the topic',
      additionalInformation: {
        instancePath: '/nmis',
        schemaPath: '#/properties/nmis/uniqueItems',
        keyword: 'uniqueItems',
        params: {
          i: 2,
          j: 1,
        },
        message:
          'must NOT have duplicate items (items ## 1 and 2 are identical)',
      },
    },
  })
  err: Error;
}


export class Recipients {
  @ApiProperty({
    description:
      'Number of recipient DIDs the message broker addressed (the channel qualified DIDs, plus anonymous recipients when given).',
    type: Number,
    example: 3,
  })
  total: number;

  @ApiProperty({
    description: 'Number of recipients the message was delivered to.',
    type: Number,
    example: 2,
  })
  sent: number;

  @ApiProperty({
    description:
      'Number of recipients the delivery failed for. The HTTP request still succeeds when some or all recipients fail, so always check this value (and `status`).',
    type: Number,
    example: 1,
  })
  failed: number;
}

export class Details {
  @ApiProperty({
    description: 'Recipient DID this entry refers to.',
    type: String,
    required: false,
    example: 'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
  })
  did?: string;

  @ApiProperty({
    description: 'Message ID of the copy for this recipient. Absent when delivery failed.',
    type: String,
    required: false,
    example: '657a1f0c2b3e4d5f6a7b8c9d',
  })
  messageId?: string;

  @ApiProperty({
    description:
      'HTTP-like status code reported by the message broker for this recipient. `200` means delivered; any other value is a failure.',
    type: Number,
    required: false,
    example: 200,
  })
  statusCode?: number;
}

export class Status {
  @ApiProperty({
    description: 'The recipients in this group.',
    type: () => [Details],
    example: [
      {
        did: 'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
        messageId: '657a1f0c2b3e4d5f6a7b8c9d',
        statusCode: 200,
      },
    ],
  })
  details: Details[];

  @ApiProperty({
    description: `Name of the result group, as reported by the message broker:
- \`SENT\`: recipients the message was delivered to.
- \`FAILED\`: recipients the delivery failed for.`,
    type: String,
    example: 'SENT',
  })
  name: string;
}

/**
 * Response of `POST /messages` and `POST /messages/upload`. It is the send
 * result of the message broker, passed through unchanged.
 */
export class SendMessageResponseDto {
  @ApiProperty({
    description: 'ID of the send request (UUID v4). The same for all recipients.',
    type: String,
    format: 'uuid',
    example: '0b271eb8-1e21-4817-95af-7951649360ed',
  })
  clientGatewayMessageId: string;

  @ApiProperty({
    description:
      'DID field of the message broker send result, passed through unchanged.',
    type: String,
    example: 'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
  })
  did: string;

  @ApiProperty({
    description: 'Delivery counters over all recipients.',
    type: () => Recipients,
  })
  recipients: Recipients;

  @ApiProperty({
    description:
      'A list of results grouped by outcome (`SENT` or `FAILED`), each with its recipients.',
    type: () => [Status],
  })
  status: Status[];
}

// Not referenced by any route; the channel module exposes its own GetChannelQualifiedDidsDto.
export class GetChannelQualifiedDidsDto {
  @ApiProperty({
    description: 'Channel name / fqcn',
    example: 'channel.name',
    type: String,
  })
  fqcn: string;

  @ApiProperty({
    description: 'List of qualified dids',
    example: [
      'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
      'did:ethr:volta:0x3Ce3B60427b4Bf0Ce366d9963BeC5ef3CBD06ad5',
    ],
    type: [String],
  })
  qualifiedDids: string[];

  @ApiProperty({
    description: 'Last update time',
    example: '2022-03-22T14:27:00.027Z',
    type: String,
  })
  updatedAt: string;
}
