import { HttpStatus } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseError<T> {
  @ApiProperty({
    type: String,
    description: 'Error message',
  })
  reason: string;

  @ApiProperty({
    enum: DsbClientGatewayErrors,
  })
  code: DsbClientGatewayErrors;

  @ApiProperty({
    description: 'Additional details',
  })
  additionalDetails: T;

  exception?: any;
}

export class ResponseErrorDto<T = any> {
  @ApiProperty({
    type: () => ResponseError,
    description: 'Error details',
  })
  err: ResponseError<T>;

  @ApiProperty({
    enum: HttpStatus,
    description: 'HTTP error code',
  })
  statusCode: HttpStatus;

  @ApiProperty({
    type: Date,
    description: 'Error timestamp',
  })
  timestamp: string;
}
