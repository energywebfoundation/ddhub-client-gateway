import { GatewayConfig } from '@ddhub-client-gateway/identity/models';
import { ApiProperty } from '@nestjs/swagger';

export enum MessageBrokerStatus {
  OK = 'OK',
  ERROR = 'ERROR',
}

export class GatewayResponseDto implements GatewayConfig {
  @ApiProperty({
    type: String,
    description: 'Configured DID',
  })
  did: string;

  @ApiProperty({
    type: Boolean,
    description: 'User auth enabled',
  })
  authEnabled: boolean;

  @ApiProperty({
    enum: MessageBrokerStatus,
    description:
      'Checks if the message broker is configured and running correctly',
  })
  messageBrokerStatus: MessageBrokerStatus;

  @ApiProperty({
    type: Boolean,
    description:
      'Checks if the gateway is configured correctly to use mTLS (if mTLS is enabled)',
  })
  mtlsIsValid?: boolean;

  @ApiProperty({
    type: String,
    description: 'Configured namespace',
    example: 'ddhub.apps.energyweb.iam.ewc',
  })
  namespace: string;

  @ApiProperty({
    type: String,
    description: 'Application version',
    example: 'v15.15.0',
  })
  version: string;
}
