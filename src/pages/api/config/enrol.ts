import type { NextApiRequest, NextApiResponse } from 'next'
import { initMessageBroker } from 'services/dsb.service'
import { initEnrolment } from 'services/identity.service'
import { getEnrolment, getIdentity } from 'services/storage.service'
import { Enrolment, ErrorCode, errorExplainer } from 'utils'

type Response = Enrolment | { err: string }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Response>
) {
    switch (req.method) {
        case 'GET':
            return forGET(req, res)
        case 'POST':
            return forPOST(req, res)
        default:
            return res.status(405).end()
    }
}

/**
 * Gets the current enrolment state
 */
async function forGET(
    req: NextApiRequest,
    res: NextApiResponse<Response>
) {
    const { some: identity } = await getIdentity()
    if (!identity) {
        return res.status(400).end({ err: ErrorCode.ID_NO_PRIVATE_KEY })
    }
    const { some: enrolment } = await getEnrolment()
    if (!enrolment || !enrolment.did) {
        return res.status(400).end({ err: ErrorCode.ID_NO_DID })
    }
    return res.status(200).send(enrolment)
}

/**
 * Attempts complete enrolment based on current state.
 * Subscribes to identity events to auto-sync claim approval
 */
async function forPOST(
    req: NextApiRequest,
    res: NextApiResponse<Response>
) {
    try {
        const { some: identity } = await getIdentity()
        if (!identity) {
            throw Error(ErrorCode.ID_NO_PRIVATE_KEY)
        }
        const { some: enrolment } = await getEnrolment()
        // todo: check if already requested approval and return early
        if (enrolment?.did && enrolment?.state.ready) {
            throw Error(ErrorCode.ID_ALREADY_ENROLED)
        }
        const { ok: requestor, err: initError } = await initEnrolment(identity)
        if (!requestor) {
            throw initError
        }
        const { ok: state, err: stateError } = await requestor.getState()
        if (!state) {
            throw stateError
        }
        const { ok: enroled, err: enrolError } = await requestor.handle(state)
        if (!enroled) {
            throw enrolError
        }
        // fetch latest state after enroling
        const { ok: newState, err: newStateError } = await requestor.getState()
        if (!newState) {
            throw newStateError
        }
        const { ok: saved, err: saveError } = await requestor.save(newState)
        if (!saved) {
            throw saveError
        }
        // side effect: start message broker (if controllable)
        await initMessageBroker({
            privateKey: identity.privateKey,
            did: requestor.did
        })
        return res.status(200).send({
            did: requestor.did,
            state: newState
        })
    } catch (err) {
        const status = errorExplainer[err.message]?.status ?? 500
        res.status(status).send({ err: err.message })
    }
}
