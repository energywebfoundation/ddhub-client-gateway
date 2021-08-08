import type { NextApiRequest, NextApiResponse } from 'next'
import { BalanceState, ErrorCode, errorExplainer } from 'utils'
import { Wallet } from 'ethers'
import { validateBalance, validatePrivateKey } from 'services/identity.service'
import { deleteEnrolment, getIdentity, writeIdentity } from 'services/storage.service'
import { isAuthorized } from 'services/auth.service'

type Response = {
    address: string
    publicKey: string
    balance: BalanceState,
} | { err: string }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Response>
) {
    const authHeader = req.headers.authorization
    const { err } = isAuthorized(authHeader)
    if (!err) {
        switch (req.method) {
            case 'GET':
                return forGET(req, res)
            case 'POST':
                return forPOST(req, res)
            default:
                return res.status(405).end()
        }
    } else {
        if (err.message === ErrorCode.UNAUTHORIZED) {
            res.status(401)
            res.setHeader("WWW-Authenticate", "Basic realm=\"Authorization Required\"")
            res.end()
        } else {
            res.status(403).end()
        }
    }
}

/**
 * Get identity stored on file
 */
async function forGET(
    req: NextApiRequest,
    res: NextApiResponse<Response>
) {
    const { some: identity } = await getIdentity()
    if (!identity) {
        return res.status(404).end()
    }
    const { ok: balance } = await validateBalance(identity.address)
    if (balance === undefined) {
        return res.status(500).send({ err: ErrorCode.ID_BALANCE_CHECK_FAILED })
    }
    return res.status(200).send({
        address: identity.address,
        publicKey: identity.publicKey,
        balance
    })
}

/**
 * Set the identity, given a private key or else generated
 */
async function forPOST(
    req: NextApiRequest,
    res: NextApiResponse<Response>
) {
    try {
        const privateKey = req.body?.privateKey ?? Wallet.createRandom().privateKey
        const { ok: identity, err: identityError } = validatePrivateKey(privateKey)
        if (!identity) {
            throw identityError
        }
        const { ok: balance, err: balanceError } = await validateBalance(identity.address)
        if (balance === undefined) {
            throw balanceError
        }
        const publicIdentity = {
            address: identity.address,
            publicKey: identity.publicKey,
            balance
        }
        const { ok: saved, err: saveError } = await writeIdentity({
            ...publicIdentity,
            privateKey
        })
        if (!saved) {
            throw saveError
        }
        await deleteEnrolment()
        return res.status(200).send(publicIdentity)
    } catch (err) {
        const status = errorExplainer[err.message]?.status ?? 500
        return res.status(status).send({ err: err.message })
    }
}
