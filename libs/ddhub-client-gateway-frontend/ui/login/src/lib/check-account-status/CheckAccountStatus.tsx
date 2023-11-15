import {
  BalanceState,
  IdentityWithEnrolment,
  RoleStatus,
} from '@ddhub-client-gateway/identity/models';

export enum AccountStatusEnum {
  INSUFFICIENT_FUNDS = 'Insufficient fund',
  NO_PRIVATE_KEY = 'Not Set Private Key',
  ERROR = 'Error Occur',
  FIRST_LOGIN = 'First Login',
}

export const checkAccountStatus = (
  res: IdentityWithEnrolment
): AccountStatusEnum | RoleStatus => {
  if (!res) {
    return AccountStatusEnum.FIRST_LOGIN;
  }

  if (isBalanceTooLow(res.balance)) {
    return AccountStatusEnum.INSUFFICIENT_FUNDS;
  }

  const requiredRoles = res.enrolment.roles
    .filter((role) => role.required)
    .filter((role) => role.status !== RoleStatus.REJECTED);

  const areRequiredSynced = requiredRoles.every(
    (role) => role.status === RoleStatus.SYNCED
  );

  const checkStatus = (status: RoleStatus) => {
    return requiredRoles.some((role) => role.status === status);
  };

  if (areRequiredSynced) {
    return RoleStatus.SYNCED;
  }

  if (checkStatus(RoleStatus.NOT_ENROLLED)) {
    return RoleStatus.NOT_ENROLLED;
  }

  if (checkStatus(RoleStatus.AWAITING_APPROVAL)) {
    return RoleStatus.AWAITING_APPROVAL;
  }

  if (checkStatus(RoleStatus.APPROVED)) {
    return RoleStatus.APPROVED;
  }

  return AccountStatusEnum.NO_PRIVATE_KEY;
};

const isBalanceTooLow = (balanceStatus: string): boolean => {
  return balanceStatus !== BalanceState.OK;
};
