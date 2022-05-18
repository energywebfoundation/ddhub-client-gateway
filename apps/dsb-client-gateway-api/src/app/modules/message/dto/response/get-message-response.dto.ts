import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsBoolean
} from 'class-validator';
import { SchemaType } from '../../../topic/topic.const';

export class GetMessagesResponseDto {
  @IsString()
  @ApiProperty({
    description: 'message id',
    type: String,
    example: '110',
  })
  id: string;

  @IsString()
  @ApiProperty({
    description: 'topic Name',
    type: String,
    example: 'getOperatingEnvelope',
  })
  topicName: string;

  @IsString()
  @ApiProperty({
    description: 'application namespace',
    type: String,
    example: 'torta.apps.eggplant.vege.iam.ewc',
  })
  topicOwner: string;
  @IsString()
  @ApiProperty({
    description: 'Topic Version',
    type: String,
    example: '1.0.0',
  })
  topicVersion: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(SchemaType)
  @ApiProperty({
    description: 'schema type of the topic',
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
    description: 'Payload sent to message',
    type: String,
    example: '{"fileId":"624bfd4f4c6cf04abfc20041"}',
  })
  payload: string;

  @IsString()
  @ApiProperty({
    description: 'signature sent to message',
    type: String,
    example:
      '0x0abc6026b01856a756de47ec6f44d9c14fe69009bbf3b9b6cf522d8d783a1c654425848381affca5dab9284d8715fa2f9e34155374bafd923d75c219496cbe161c',
  })
  signature: string;

  @IsString()
  @ApiProperty({
    description: 'signature sent to message',
    type: String,
    example: 'did:ethr:volta:0x03830466Ce257f9B798B0f27359D7639dFB6457D',
  })
  sender: string;

  @IsNumber()
  @ApiProperty({
    description: 'signature sent to message',
    type: Number,
    example: 1649147198388,
  })
  timestampNanos: number;

  @IsString()
  @ApiProperty({
    description: 'transactionId sent to message for idempotency',
    type: String,
    example: '1649147198388',
  })
  transactionId: string;

  @IsBoolean()
  @ApiProperty({
    description: 'transactionId sent to message for idempotency',
    type: Boolean,
    example: true,
  })
  signatureValid: boolean;
}
