import { Wallet } from "ethers";
import { initIdentity } from "services/identity.service";
import { ErrorCode, HttpError } from "utils";

describe('IdentityService', () => {

    it('should return error if private key is invalid', async () => {
        const { ok, err } = await initIdentity('0x0')
        expect(ok).toBeUndefined()
        expect(err?.message).toBe(ErrorCode.ID_INVALID_PRIVATE_KEY)
    })

    it('should return error if private key has no funds', async () => {
        const { privateKey } = Wallet.createRandom()
        const { ok, err } = await initIdentity(privateKey)
        expect(ok).toBeUndefined()
        expect(err?.message).toBe(ErrorCode.ID_NO_BALANCE)
    })

})
