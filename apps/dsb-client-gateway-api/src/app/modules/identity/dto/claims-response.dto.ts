import { RoleState } from '@dsb-client-gateway/dsb-client-gateway/identity/models';

export class ClaimResponseDto {
  namespace: string;
  status: RoleState;
  syncedToDidDoc: boolean;
}

export class ClaimsResponseDto {
  did: string;
  claims: ClaimResponseDto[];
}
