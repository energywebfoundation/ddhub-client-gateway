import {
  BalanceState,
  IdentityWithEnrolment,
  RoleStatus,
} from '@ddhub-client-gateway/identity/models';

export enum AccountStatusEnum {
  InsufficientFund = 'Insufficient fund',
  NotSetPrivateKey = 'Not Set Private Key',
  ErrorOccur = 'Error Occur',
}

export const checkAccountStatus = (
  res: IdentityWithEnrolment
): AccountStatusEnum | RoleStatus => {
  if (!res) {
    return AccountStatusEnum.NotSetPrivateKey;
  }
  if (isBalanceToLow(res.balance)) {
    return AccountStatusEnum.InsufficientFund;
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

  return AccountStatusEnum.NotSetPrivateKey;
};

const isBalanceToLow = (balanceStatus: string): boolean => {
  return balanceStatus !== BalanceState.OK;
};
