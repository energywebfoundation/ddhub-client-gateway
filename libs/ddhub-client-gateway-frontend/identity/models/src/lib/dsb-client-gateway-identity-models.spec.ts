import {
  RoleState,
  RoleStatus,
} from './dsb-client-gateway-identity-models';
import { BalanceState } from './balance.enum';

describe('dsb-client-gateway-identity-models', () => {
  it('exports role and balance enums', () => {
    expect(RoleState.APPROVED).toBe('APPROVED');
    expect(RoleStatus.SYNCED).toBe('SYNCED');
    expect(BalanceState.OK).toBe('OK');
  });
});
