import { BalanceState } from './balance.enum';
import { Enrolment } from './dsb-client-gateway-identity-models';

export interface IdentityWithEnrolment {
  address: string;
  publicKey: string;
  balance: BalanceState;
  enrolment: Enrolment;
}
