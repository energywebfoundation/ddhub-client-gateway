import { GatewayConfig } from '@ddhub-client-gateway/identity/models';
import { ApiProperty } from '@nestjs/swagger';

export enum MessageBrokerStatus {
  OK = 'OK',
  ERROR = 'ERROR',
}

export class GatewayResponseDto implements GatewayConfig {
  @ApiProperty({
    type: String,
    nullable: true,
    description: 'DID of the gateway. Null when no identity is set up.',
    example: 'did:ethr:volta:0xfeFBb03EFc1054Cc4e3Fbf36362689cc1F5924a8',
  })
  did: string;

  @ApiProperty({
    type: Boolean,
    description: [
      'Whether user login is enabled (`USER_AUTH_ENABLED`, default `false`).',
      '- `true`: protected endpoints need a login token or an API key.',
      '- `false`: all endpoints are open.',
    ].join('\n'),
    example: true,
  })
  authEnabled: boolean;

  @ApiProperty({
    enum: MessageBrokerStatus,
    description: [
      'Whether the gateway can reach the EWDS Message Broker:',
      '- `OK`: yes.',
      '- `ERROR`: no, for example because the certificate is missing or wrong. Messaging does not work.',
    ].join('\n'),
    example: MessageBrokerStatus.OK,
  })
  messageBrokerStatus: MessageBrokerStatus;

  @ApiProperty({
    type: Boolean,
    required: false,
    description: [
      'Whether the gateway certificate is loaded. Only present when `MTLS_ENABLED=true` (the default).',
      '- `true`: loaded.',
      '- `false`: not uploaded yet.',
      '- Does not show whether the broker accepts it (see `messageBrokerStatus`).',
    ].join('\n'),
    example: true,
  })
  mtlsIsValid?: boolean;

  @ApiProperty({
    type: Boolean,
    description: [
      'Whether association key sharing is set up:',
      '- `true`: `AK_FQCN`, `AK_TOPIC_NAME`, `AK_TOPIC_OWNER` and `AK_TOPIC_VERSION` are set.',
      '- `false`: at least one is missing.',
    ].join('\n'),
    example: false,
  })
  isAssociationKeyEnabled: boolean;

  @ApiProperty({
    type: String,
    description: 'Application namespace the gateway enrols under (`PARENT_NAMESPACE`). The required role is `user.roles.<namespace>`.',
    example: 'ddhub.apps.energyweb.iam.ewc',
  })
  namespace: string;

  @ApiProperty({
    type: String,
    description:
      'Version of the gateway. `NOT_DETECTED` when the version is unknown.',
    example: 'v15.15.0',
  })
  version: string;
}
