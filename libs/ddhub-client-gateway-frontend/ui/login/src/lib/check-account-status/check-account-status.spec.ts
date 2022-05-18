import { AccountStatusEnum, checkAccountStatus } from './check-account-status';
import {
  BalanceState,
  IdentityWithEnrolment,
  RoleStatus,
} from '@ddhub-client-gateway/identity/models';

describe('checkAccountStatus', () => {
  it('should return Insufficient fund when balance is low', () => {
    expect(
      checkAccountStatus({
        balance: BalanceState.LOW,
      } as unknown as IdentityWithEnrolment)
    ).toBe(AccountStatusEnum.InsufficientFund);
  });

  it('should return insufficient fund when balance is NONE', () => {
    expect(
      checkAccountStatus({
        balance: BalanceState.NONE,
      } as unknown as IdentityWithEnrolment)
    ).toBe(AccountStatusEnum.InsufficientFund);
  });

  it('should return awaiting approval status when at least one required role have this status', () => {
    expect(
      checkAccountStatus({
        balance: BalanceState.OK,
        enrolment: {
          roles: [
            {
              namespace: 'required.role',
              status: RoleStatus.AWAITING_APPROVAL,
              required: true,
            },
            {
              namespace: 'required.role',
              status: RoleStatus.SYNCED,
              required: true,
            },
          ],
        },
      } as unknown as IdentityWithEnrolment)
    ).toBe(RoleStatus.AWAITING_APPROVAL);
  });
});
