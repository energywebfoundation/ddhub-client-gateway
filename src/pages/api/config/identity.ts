import type { NextApiRequest, NextApiResponse } from 'next'
import { BalanceState, RoleState, errorExplainer, ErrorCode } from 'utils'
import { Wallet } from 'ethers'
import { initIdentity } from 'services/identity.service'
import { initMessageBroker } from 'services/dsb.service'
import { getIdentity } from 'services/storage.service'

type Response = {
    did?: string
    address: string
    publicKey: string
    balance: BalanceState,
    status?: {
        user: RoleState,
        messagebroker: RoleState
    }
} | { err: string }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Response>
) {
    try {
        if (req.method !== 'POST') {
            return res.status(405).end()
        }
        // take optional private key or generate a new one
        const privateKey = req.body?.privateKey ?? Wallet.createRandom().privateKey
        const { ok: identity, err: initError } = await initIdentity(privateKey)
        if (!identity) {
            if (initError?.message === ErrorCode.ID_NO_BALANCE) {
                const { some: identity } = await getIdentity()
                if (!identity) {
                    throw Error(ErrorCode.DISK_PERSIST_FAILED)
                }
                return res.status(200).json({
                    address: identity.address,
                    publicKey: identity.publicKey,
                    balance: identity.balance
                })
            }
            throw initError
        }
        // get current state to know which claims need enrolment
        const { ok: state, err: stateError } = await identity.getEnrolmentState()
        if (!state) {
            throw stateError
        }
        // exit early if already approved
        if (state.ready) {
            const { ok: persisted, err: persistError } = await identity.save(state)
            if (!persisted) {
                throw persistError
            }
            // fire and forget starting the message broker
            await initMessageBroker({ privateKey, did: identity.did })
            return res.status(200).json({
                did: identity.did,
                address: identity.address,
                publicKey: identity.publicKey,
                balance: identity.balance,
                status: state
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
        const { ok: persisted, err: persistError } = await identity.save(newState)
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
            did: identity.did,
            address: identity.address,
            publicKey: identity.publicKey,
            balance: identity.balance,
            status: newState
        })
    } catch (err) {
        const status = errorExplainer[err.message]?.status ?? 500
        return res.status(status).json({ err: err.message })
    }
}
