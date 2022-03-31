import { BalanceState } from '../utils/balance.const';
import { Enrolment } from '../storage/storage.interface';

export interface IdentityWithEnrolment {
  address: string;
  publicKey: string;
  balance: BalanceState;
  enrolment: Enrolment;
}
