import { RoleStatus } from '@ddhub-client-gateway/identity/models';

export class ClaimResponseDto {
  namespace: string;
  status: RoleStatus;
  syncedToDidDoc: boolean;
}

export class ClaimsResponseDto {
  did: string;
  claims: ClaimResponseDto[];
}
