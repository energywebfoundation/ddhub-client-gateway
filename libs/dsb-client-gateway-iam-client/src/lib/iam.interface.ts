import {
  IAppDefinition,
  IFieldDefinition,
} from '@energyweb/credential-governance';
import { RoleStatus } from '@ddhub-client-gateway/identity/models';
import { ApiProperty } from '@nestjs/swagger';

export class ApplicationDTO implements IAppDefinition {
  appName: string;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
  namespace?: string;
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
  @ApiProperty()
  id: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  requestDate: string;

  @ApiProperty()
  namespace: string;

  @ApiProperty({
    enum: RoleStatus,
    description: 'Role status',
  })
  status: RoleStatus;

  @ApiProperty()
  expirationDate?: string;

  @ApiProperty()
  expirationStatus?: string;
}

export class SearchAppDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  namespace: string;

  @ApiProperty()
  appName: string;

  @ApiProperty()
  logoUrl: string;
}

export class FieldDefinitionDTO implements IFieldDefinition {
  @ApiProperty({
    oneOf: [
      { type: 'string', enum: ['text', 'number', 'date', 'boolean', 'json'] },
    ],
  })
  fieldType: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  required?: boolean;

  @ApiProperty()
  minLength?: number;

  @ApiProperty()
  maxLength?: number;

  @ApiProperty()
  pattern?: string;

  @ApiProperty()
  minValue?: number;

  @ApiProperty()
  maxValue?: number;

  @ApiProperty()
  minDate?: Date;

  @ApiProperty()
  maxDate?: Date;
}

export class ApplicationRoleDTO {
  @ApiProperty()
  role: string;

  @ApiProperty()
  namespace: string;

  @ApiProperty({ type: [FieldDefinitionDTO] })
  requestorFields?: FieldDefinitionDTO[];
}

export class RequestorFieldDTO {
  public key: string;
  public value: string | number;
}
