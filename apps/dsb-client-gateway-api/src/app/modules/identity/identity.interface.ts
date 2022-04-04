import { BalanceState } from '../utils/balance.const';
import { Enrolment, RoleState } from '../storage/storage.interface';

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
