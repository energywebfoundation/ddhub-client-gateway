import { IAppDefinition } from '@energyweb/credential-governance';
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
  role: string;

  @ApiProperty()
  requestDate: string;

  @ApiProperty()
  namespace: string;

  @ApiProperty()
  status: string;

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

export class ApplicationRoleDTO {
  @ApiProperty()
  role: string;

  @ApiProperty()
  namespace: string;
}
