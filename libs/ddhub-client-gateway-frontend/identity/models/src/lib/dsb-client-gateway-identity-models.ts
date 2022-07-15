import { BalanceState } from './balance.enum';

export enum RoleState {
  NO_CLAIM = 'NO_CLAIM',
  AWAITING_APPROVAL = 'AWAITING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'rejected',
  NOT_WANTED = 'NOT_WANTED', // if gateway is not controlling message broker
  UNKNOWN = 'unknown',
}

export type EnrolmentState = {
  approved: boolean;
  waiting: boolean;
  roles: {
    user: RoleState;
  };
};

export interface Identity {
  address: string;
  publicKey: string;
  balance: BalanceState;
}

export enum RoleStatus {
  NOT_ENROLLED = 'NOT_ENROLLED',
  AWAITING_APPROVAL = 'AWAITING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SYNCED = 'SYNCED',
}

export interface Role {
  namespace: string;
  status: RoleStatus;
  required: boolean;
}

export interface Enrolment {
  did: string | null;
  roles: Role[];
}
