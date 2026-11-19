import {
  IAppDefinition,
  IFieldDefinition,
} from '@energyweb/credential-governance';
import { RoleStatus } from '@ddhub-client-gateway/identity/models';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApplicationDTO implements IAppDefinition {
  @ApiProperty({
    description: 'The name of the application',
    example: 'My Energy App',
  })
  appName: string;

  @ApiProperty({
    description: 'URL to the application logo image',
    example: 'https://example.com/logo.png',
    required: false,
  })
  logoUrl?: string;

  @ApiProperty({
    description: 'URL to the application website',
    example: 'https://myenergyapp.com',
    required: false,
  })
  websiteUrl?: string;

  @ApiProperty({
    description: 'Description of the application',
    example: 'A decentralized energy trading platform',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'The namespace identifier for the application',
    example: 'energy.trading.v1',
    required: false,
  })
  namespace?: string;

  @ApiProperty({
    description: 'Number of topics associated with this application',
    example: 5,
    required: false,
  })
  topicsCount?: number;
}

export interface Claim {
  namespace: string;
  status: RoleStatus;
  syncedToDidDoc: boolean;
}

export interface Claims {
  did: string;
  claims: Claim[];
}

export class RequesterClaimDTO {
  @ApiProperty({
    description: 'Id of the role request. Use it to withdraw a pending request.',
    example: '7281a130-e2b1-430d-8c14-201010eae901',
  })
  id: string;

  @ApiProperty({
    description:
      'Token of the role request, as kept by SSI Hub. For information only; no gateway endpoint needs it.',
    example: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGFpbURhdGEiOnt9fQ.c2lnbmF0dXJl',
  })
  token: string;

  @ApiProperty({
    description:
      'Short role name: the first segment of the claim type (for `user.roles.ddhub.apps.energyweb.iam.ewc` it is `user`).',
    example: 'user',
  })
  role: string;

  @ApiProperty({
    description: 'When the claim was requested, as reported by SSI Hub (ISO 8601).',
    format: 'date-time',
    example: '2024-01-15T10:30:00.000Z',
  })
  requestDate: string;

  @ApiProperty({
    description:
      'Namespace of the application or organisation that defines the role (the claim type without its `<role>.roles.` prefix).',
    example: 'ddhub.apps.energyweb.iam.ewc',
  })
  namespace: string;

  @ApiProperty({
    enum: RoleStatus,
    description: [
      'Status of the request:',
      '- `AWAITING_APPROVAL`: waiting for an issuer; can be withdrawn.',
      '- `APPROVED`: approved; the gateway publishes it within about a minute.',
      '- `REJECTED`: rejected; request it again if needed.',
    ].join('\n'),
    example: RoleStatus.APPROVED,
  })
  status: RoleStatus;

  @ApiProperty({
    description:
      'When the issued credential expires (ISO 8601). Null when the claim has no expiration.',
    format: 'date-time',
    example: '2025-12-31T23:59:59.000Z',
    required: false,
    nullable: true,
  })
  expirationDate?: string;

  @ApiProperty({
    description: [
      'Expiration state of the claim:',
      '- `EXPIRED`: `expirationDate` is in the past; the role is no longer valid and must be requested again.',
      '- `null`: not expired, or no expiration set.',
    ].join('\n'),
    example: 'EXPIRED',
    required: false,
    nullable: true,
  })
  expirationStatus?: string;
}

export class SearchAppDTO {
  @ApiProperty({
    description:
      'Name of the application or organisation node in SSI Hub (usually the first label of its namespace).',
    example: 'ddhub',
  })
  name: string;

  @ApiProperty({
    description: 'Full namespace of the application or organisation.',
    example: 'ddhub.apps.energyweb.iam.ewc',
  })
  namespace: string;

  @ApiProperty({
    description:
      'Display name from the application definition. Empty string for organisations, which have no application definition.',
    example: 'EWDS',
  })
  appName: string;

  @ApiProperty({
    description:
      'Logo URL from the application definition. Empty string for organisations; omitted when an application defines no logo.',
    example: 'https://example.com/logo.png',
    required: false,
  })
  logoUrl: string;
}

export class FieldDefinitionDTO implements IFieldDefinition {
  @ApiProperty({
    oneOf: [
      { type: 'string', enum: ['text', 'number', 'date', 'boolean', 'json'] },
    ],
    description: [
      'Type of the field:',
      '- `text`: `minLength`, `maxLength` and `pattern` may apply.',
      '- `number`: `minValue` and `maxValue` may apply.',
      '- `date`: `minDate` and `maxDate` may apply.',
      '- `boolean`: true or false.',
      '- `json`: a JSON document sent as a string; `schema` may describe it.',
    ].join('\n'),
    example: 'text',
  })
  fieldType: string;

  @ApiProperty({
    description: 'Label of the field. Send it as `key` when requesting the role.',
    example: 'Company Name',
  })
  label: string;

  @ApiProperty({
    description: 'Whether a value must be provided. Treated as false when omitted.',
    example: true,
    required: false,
  })
  required?: boolean;

  @ApiProperty({
    description: 'Minimum number of characters (`text` fields).',
    example: 3,
    required: false,
  })
  minLength?: number;

  @ApiProperty({
    description: 'Maximum number of characters (`text` fields).',
    example: 100,
    required: false,
  })
  maxLength?: number;

  @ApiProperty({
    description: 'Regular expression the value must match (`text` fields).',
    example: '^[A-Za-z0-9 ]+$',
    required: false,
  })
  pattern?: string;

  @ApiProperty({
    description: 'Smallest allowed value (`number` fields).',
    example: 0,
    required: false,
  })
  minValue?: number;

  @ApiProperty({
    description: 'Largest allowed value (`number` fields).',
    example: 1000,
    required: false,
  })
  maxValue?: number;

  @ApiProperty({
    description: 'Earliest allowed date (`date` fields).',
    example: '2020-01-01',
    required: false,
  })
  minDate?: Date;

  @ApiProperty({
    description: 'Latest allowed date (`date` fields).',
    example: '2030-12-31',
    required: false,
  })
  maxDate?: Date;

  @ApiPropertyOptional({
    description:
      'JSON Schema the value should conform to (`json` fields), as defined by the role owner.',
    type: 'object',
    additionalProperties: true,
    example: { type: 'object', properties: { id: { type: 'string' } } },
  })
  schema?: Record<string, unknown>;
}

export class ApplicationRoleDTO {
  @ApiProperty({
    description:
      'Short role name (first label of the role namespace), e.g. `user` for `user.roles.ddhub.apps.energyweb.iam.ewc`.',
    example: 'user',
  })
  role: string;

  @ApiProperty({
    description: 'Full role namespace (`<role>.roles.<application namespace>`). Send it as `role` when requesting the role.',
    example: 'user.roles.ddhub.apps.energyweb.iam.ewc',
  })
  namespace: string;

  @ApiProperty({
    type: [FieldDefinitionDTO],
    description: 'Fields to fill in when requesting this role. Empty when there are none.',
    required: false,
  })
  requestorFields?: FieldDefinitionDTO[];
}

export class RequestorFieldDTO {
  @ApiProperty({
    description:
      'Field name: the `label` of the matching role field definition.',
    example: 'Company Name',
  })
  public key: string;

  @ApiProperty({
    description: 'Field value, a string or a number.',
    oneOf: [{ type: 'string' }, { type: 'number' }],
    example: 'Acme Energy Ltd',
  })
  public value: string | number;
}
