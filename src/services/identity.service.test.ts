import { Wallet } from "ethers";
import { initEnrolment } from "services/identity.service";
import { BalanceState, ErrorCode } from "utils";

describe('IdentityService', () => {

    it('should return error if private key is invalid', async () => {
        const { ok, err } = await initEnrolment({
            address: '0x0',
            publicKey: '0x0',
            privateKey: '0x0',
            balance: BalanceState.NONE
        })
        expect(ok).toBeUndefined()
        expect(err?.message).toBe(ErrorCode.ID_INVALID_PRIVATE_KEY)
    })

    it('should return error if private key has no funds', async () => {
        const { address, publicKey, privateKey } = Wallet.createRandom()
        const { ok, err } = await initEnrolment({
            address,
            publicKey,
            privateKey,
            balance: BalanceState.NONE
        })
        expect(ok).toBeUndefined()
        expect(err?.message).toBe(ErrorCode.ID_NO_BALANCE)
    })

})
