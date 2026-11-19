import { HttpStatus } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseError<T> {
  @ApiProperty({
    type: String,
    description:
      'Human-readable explanation of the error. Intended for logs and operators; the wording may change between versions, so do not parse it.',
    example: 'Validation failed',
  })
  reason: string;

  @ApiProperty({
    enum: DsbClientGatewayErrors,
    description: `Stable, namespaced error code. Use this value for programmatic error handling.

- \`DHCG::UNKNOWN\`: unexpected error. Also returned for errors that the gateway does not map explicitly.
- \`DHCG::UNAUTHORIZED\`: missing or invalid credentials, a role that may not call the endpoint, or mTLS could not be configured (HTTP 403).
- \`DHCG::ROUTE_NOT_FOUND\`: the route or the requested resource does not exist (HTTP 404).
- \`VALIDATION::FAILED\`: the request did not pass validation; see \`additionalDetails.errors\` (HTTP 400).
- \`ID::*\`: gateway identity errors, for example no private key configured yet (\`ID::NO_PRIVATE_KEY\`) or an invalid private key (\`ID::INVALID_PRIVATE_KEY\`).
- \`IAM::*\`: the gateway identity is not loaded yet, usually because none is set up.
- \`BIP39::*\`: association key mnemonic or key not available.
- \`MB::*\` and \`DDHUB::*\`: the EWDS Message Broker rejected or failed the request, or could not be reached.
- \`CHANNEL::*\`: channel configuration errors (already exists, not found, restricted field update, invalid type or topic schema type, message forms only).
- \`TOPIC::*\`: topic not found or not related to the channel.
- \`MESSAGING::*\`: message and file exchange errors (missing recipients, decryption failed, file too large or of the wrong type, file not found, maximum number of clients reached, request lock).
- \`SIG::NO_MATCH\`: the message signature does not match the sender DID document.
- \`SECRETS_ENGINE::INVALID\`: the gateway's secret storage is not configured correctly (an operator setting, not a request error).
- \`CONTACT::NOT_FOUND\`: the address book contact does not exist.`,
    example: DsbClientGatewayErrors.VALIDATION_FAILED,
  })
  code: DsbClientGatewayErrors;

  @ApiPropertyOptional({
    description: [
      'Extra details, when available.',
      '- `VALIDATION::FAILED`: `{ "errors": [...] }`, a list of the rules that failed.',
      '- Message Broker errors: the error the broker returned.',
    ].join('\n'),
    type: 'object',
    additionalProperties: true,
    example: { errors: ['fqcn must be a string'] },
  })
  additionalDetails: T;

  exception?: unknown;
}

export class ResponseErrorDto<T = unknown> {
  @ApiProperty({
    type: () => ResponseError,
    description: 'Error details.',
  })
  err: ResponseError<T>;

  @ApiProperty({
    type: Number,
    description:
      'HTTP status code of the response, repeated in the body for convenience.',
    example: HttpStatus.BAD_REQUEST,
  })
  statusCode: HttpStatus;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Time the error was produced, in ISO 8601 (UTC).',
    example: '2026-01-01T00:00:00.000Z',
  })
  timestamp: string;
}
