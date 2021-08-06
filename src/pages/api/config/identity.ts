import type { NextApiRequest, NextApiResponse } from 'next'
import { Result, ErrorCode } from 'utils'
import { BalanceState, initIdentity, RoleState } from 'services/identity.service'
import { initMessageBroker } from 'services/dsb.service'


type Response = {
    did: string
    publicKey: string
    balance: BalanceState,
    status: {
        user: RoleState,
        messagebroker: RoleState
    }
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
        // get current state to know which claims need enrolment
        const { ok: state, err: stateError } = await identity.getEnrolmentState()
        if (!state) {
            throw stateError
        }
        // exit early if already approved
        if (state.ready) {
            const { ok: persisted, err: persistError } = await identity.writeToFile(state)
            if (!persisted) {
                throw persistError
            }
            // fire and forget starting the message broker
            await initMessageBroker({ privateKey, did: identity.did })
            return res.status(200).json({
                ok: {
                    did: identity.did,
                    publicKey: identity.publicKey,
                    balance: identity.balance,
                    status: state
                }
            })
        }
        // create messagebroker + user claims
        const { ok: enroled, err: enrolError } = await identity.handleEnrolement(state)
        if (!enroled) {
            throw enrolError
        }
        // fetch the state again based on new enrolments
        const { ok: newState, err: newStateError } = await identity.getEnrolmentState()
        if (!newState) {
            throw newStateError
        }
        // persist the current state
        const { ok: persisted, err: persistError } = await identity.writeToFile(newState)
        if (!persisted) {
            throw persistError
        }
        const { ok: broker, err: brokerError } = await initMessageBroker({
            privateKey,
            did: identity.did
        })
        if (!broker) {
            throw brokerError
        }
        // fire and forget starting the message broker
        await initMessageBroker({ privateKey, did: identity.did })
        return res.status(200).json({
            ok: {
                did: identity.did,
                publicKey: identity.publicKey,
                balance: identity.balance,
                status: newState
            }
        })
    } catch (err) {
        return res.status(err.statusCode ?? 500).json({ err: err.message })
    }
}
