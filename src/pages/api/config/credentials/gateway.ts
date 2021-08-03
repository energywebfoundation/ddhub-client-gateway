import type { NextApiRequest, NextApiResponse } from 'next'
import { Result } from 'utils'
import { initIdentity } from 'services/identity.service'
import { ErrorCode } from 'utils/errors'


type Response = {
    did: string
    publicKey: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Result<Response, string>>
) {
    try {
        const { privateKey } = req.body
        if (!privateKey) {
            throw new Error(ErrorCode.NO_PRIVATE_KEY)
        }
        const { ok: identity, err: initError } = await initIdentity(privateKey)
        if (!identity) {
            throw initError
        }
        const { ok: state, err: stateError } = await identity.getEnrolmentState()
        if (!state) {
            throw stateError
        }
        const { ok: enroled, err: enrolError } = await identity.handleEnrolement(state)
        if (!enroled) {
            throw enrolError
        }
        const { ok: persisted, err: persistError } = await identity.writeToFile()
        if (!persisted) {
            throw persistError
        }
        return {
            ok: {
                did: identity.did,
                publicKey: identity.publicKey
            }
        }
    } catch (err) {
        return res.status(err.statusCode ?? 500).json({ err: err.message })
    }
}
