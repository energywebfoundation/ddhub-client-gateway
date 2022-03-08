import { BalanceState } from '../utils/balance.const';

export enum RoleState {
  NO_CLAIM = 'NO_CLAIM',
  AWAITING_APPROVAL = 'AWAITING_APPROVAL',
  APPROVED = 'APPROVED',
  NOT_WANTED = 'NOT_WANTED' // if gateway is not controlling message broker
}

export type EnrolmentState = {
  approved: boolean
  waiting: boolean
  roles: {
    user: RoleState
  }
}

export interface Identity {
  address: string;
  publicKey: string;
  balance: BalanceState;
}

export interface Enrolment {
  did: string;
  state: EnrolmentState;
}

export interface CertificateFiles {
  cert: string;
  key?: string;
  ca?: string;
}

export interface Keys {
  privateMasterKey: string;
  publicMasterKey: string;
  createdAt: string;
  privateDerivedKey: string | null;
}
