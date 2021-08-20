import { Wallet } from "ethers";
import { initEnrolment, validatePrivateKey } from "./identity.service";
import { BalanceState, ErrorCode } from "../utils";

describe('IdentityService', () => {

    describe('validatePrivateKey', () => {
        const negativeTests = [
            '0x0',
            '0x01',
            '0x97Dc9eAeC977874f0A8fe4aF65a3f3F13dB03A81',
            'did:ethr:0x97Dc9eAeC977874f0A8fe4aF65a3f3F13dB03A81'
        ]

        for (const test of negativeTests) {
            it(`should return error on invalid private key: ${test}`, () => {
                const { ok, err } = validatePrivateKey(test)
                expect(ok).toBeUndefined()
                expect(err?.message).toBe(ErrorCode.ID_INVALID_PRIVATE_KEY)
            })
        }

        const positiveTests = [
            {
                name: 'no-prefix',
                value: '3a041efebac059bdc34dd76ac8a1a31d389e7529b2c6207b0a4aa24eb899daa2',
            },
            {
                name: '0x-prefix',
                value: '0x3a041efebac059bdc34dd76ac8a1a31d389e7529b2c6207b0a4aa24eb899daa2'
            }
        ]

        for (const test of positiveTests) {
            it(`should return wallet for valid private key: ${test.name}`, () => {
                const { ok, err } = validatePrivateKey(test.value)
                expect(ok?.address).toBe('0x785B428C7279a75b14cD9A782e72e42E70Db58f0')
                expect(err).toBeUndefined()
            })
        }

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
    }, 20 * 1000) // 20s timeout - can be rate limited by rpc

})
