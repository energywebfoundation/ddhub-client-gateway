import { BalanceState } from './balance.enum';
import { Enrolment, RoleState } from './dsb-client-gateway-identity-models';

export interface IdentityWithEnrolment {
  address: string;
  publicKey: string;
  balance: BalanceState;
  enrolment: Enrolment;
}

export interface Claim {
  namespace: string;
  status: RoleState;
  syncedToDidDoc: boolean;
}

export interface Claims {
  did: string;
  claims: Claim[];
}
