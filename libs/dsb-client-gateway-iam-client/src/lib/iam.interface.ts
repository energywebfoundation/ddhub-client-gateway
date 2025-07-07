import {
  IAppDefinition,
  IFieldDefinition,
} from '@energyweb/credential-governance';
import { RoleStatus } from '@ddhub-client-gateway/identity/models';
import { ApiProperty } from '@nestjs/swagger';

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
    description: 'Unique identifier for the claim request',
    example: 'claim-12345',
  })
  id: string;

  @ApiProperty({
    description: 'Authentication token for the claim request',
  })
  token: string;

  @ApiProperty({
    description: 'The role being requested',
    example: 'energy.producer.iam.ewc',
  })
  role: string;

  @ApiProperty({
    description: 'Date when the claim request was submitted',
    example: '2024-01-15T10:30:00Z',
  })
  requestDate: string;

  @ApiProperty({
    description: 'The namespace for the claim',
    example: 'energy.trading.iam.ewc',
  })
  namespace: string;

  @ApiProperty({
    enum: RoleStatus,
    description: 'Current status of the role claim request',
    example: 'PENDING',
  })
  status: RoleStatus;

  @ApiProperty({
    description: 'Date when the claim expires',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  expirationDate?: string;

  @ApiProperty({
    description: 'Status indicating if the claim has expired',
    example: 'ACTIVE',
    required: false,
  })
  expirationStatus?: string;
}

export class SearchAppDTO {
  @ApiProperty({
    description: 'Display name of the application',
    example: 'Energy Trading Platform',
  })
  name: string;

  @ApiProperty({
    description: 'The namespace identifier for the application',
    example: 'energy.trading.iam.ewc',
  })
  namespace: string;

  @ApiProperty({
    description: 'Internal application name identifier',
    example: 'energy-trading-app',
  })
  appName: string;

  @ApiProperty({
    description: 'URL to the application logo image',
    example: 'https://example.com/logo.png',
  })
  logoUrl: string;
}

export class FieldDefinitionDTO implements IFieldDefinition {
  @ApiProperty({
    oneOf: [
      { type: 'string', enum: ['text', 'number', 'date', 'boolean', 'json'] },
    ],
    description: 'The type of field for form validation and UI rendering',
    example: 'text',
  })
  fieldType: string;

  @ApiProperty({
    description: 'Human-readable label for the field',
    example: 'Company Name',
  })
  label: string;

  @ApiProperty({
    description: 'Whether this field is required for submission',
    example: true,
    required: false,
  })
  required?: boolean;

  @ApiProperty({
    description: 'Minimum length requirement for text fields',
    example: 3,
    required: false,
  })
  minLength?: number;

  @ApiProperty({
    description: 'Maximum length requirement for text fields',
    example: 100,
    required: false,
  })
  maxLength?: number;

  @ApiProperty({
    description: 'Regular expression pattern for field validation',
    example: '^[A-Za-z0-9]+$',
    required: false,
  })
  pattern?: string;

  @ApiProperty({
    description: 'Minimum value for numeric fields',
    example: 0,
    required: false,
  })
  minValue?: number;

  @ApiProperty({
    description: 'Maximum value for numeric fields',
    example: 1000,
    required: false,
  })
  maxValue?: number;

  @ApiProperty({
    description: 'Minimum allowed date for date fields',
    example: '2020-01-01',
    required: false,
  })
  minDate?: Date;

  @ApiProperty({
    description: 'Maximum allowed date for date fields',
    example: '2030-12-31',
    required: false,
  })
  maxDate?: Date;
}

export class ApplicationRoleDTO {
  @ApiProperty({
    description: 'The role identifier within the application',
    example: 'energy.producer.iam.ewc',
  })
  role: string;

  @ApiProperty({
    description: 'The namespace for the application role',
    example: 'energy.trading.iam.ewc',
  })
  namespace: string;

  @ApiProperty({
    type: [FieldDefinitionDTO],
    description: 'Array of field definitions required for role requestors',
    required: false,
  })
  requestorFields?: FieldDefinitionDTO[];
}

export class RequestorFieldDTO {
  @ApiProperty({
    description: 'The field key/identifier',
    example: 'companyName',
  })
  public key: string;

  @ApiProperty({
    description: 'The field value (can be string or number)',
    example: 'Acme Energy Corp',
  })
  public value: string | number;
}
