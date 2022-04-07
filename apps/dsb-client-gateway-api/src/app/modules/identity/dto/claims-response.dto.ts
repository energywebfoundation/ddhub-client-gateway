import { RoleStatus } from '@dsb-client-gateway/dsb-client-gateway/identity/models';

export class ClaimResponseDto {
  namespace: string;
  status: RoleStatus;
  syncedToDidDoc: boolean;
}

export class ClaimsResponseDto {
  did: string;
  claims: ClaimResponseDto[];
}
