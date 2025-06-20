import { IAppDefinition, IFieldDefinition } from '@energyweb/credential-governance';
import { RoleStatus } from '@ddhub-client-gateway/identity/models';

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
  id: string;
  token: string;
  role: string;
  requestDate: string;
  namespace: string;
  status: string;
  expirationDate?: string;
  expirationStatus?: string;
}

export class SearchAppDTO {
  name: string;
  namespace: string;
  appName: string;
  logoUrl: string;
}

export class ApplicationRoleDTO {
  role: string;
  namespace: string;
  requestorFields?: IFieldDefinition[];
}

export class RequestorFieldDTO {
  public key: string;
  public value: string | number;
}
