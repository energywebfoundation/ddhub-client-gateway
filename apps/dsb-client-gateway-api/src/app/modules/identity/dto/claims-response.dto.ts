import { RoleState } from '../../storage/storage.interface';

export class ClaimResponseDto {
  namespace: string;
  status: RoleState;
  syncedToDidDoc: boolean;
}

export class ClaimsResponseDto {
  did: string;
  claims: ClaimResponseDto[];
}
