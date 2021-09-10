import { NextApiRequest, NextApiResponse } from "next"
import { isAuthorized } from "../../../../services/auth.service"
import { ErrorCode, ErrorBody, SignatureCheckError, BadRequestError } from "../../../../utils"
import { utils } from 'ethers'

type Response = { ok: true } | { err: ErrorBody }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Response>
) {
    if (req.method !== 'POST') {
        return res.status(405).send({ ok: true })
    }
    const authHeader = req.headers.authorization
    const { err } = isAuthorized(authHeader)
    if (!err) {
        return verifySignature(req, res)
    } else {
        if (err.message === ErrorCode.UNAUTHORIZED) {
            res.status(401)
            res.setHeader("WWW-Authenticate", "Basic realm=\"Authorization Required\"")
            res.end()
        } else {
            res.status(403).end()
        }
    }
};

async function verifySignature(
    req: NextApiRequest,
    res: NextApiResponse<Response>
) {

    if (!req.body.signature || !req.body.did || !req.body.payload) {
        return res.status(400).json({
            err: new BadRequestError('signature, did, payload all required').body
        })
    }

    if (typeof (req.body.signature) !== 'string' ||
        typeof (req.body.did) !== 'string' ||
        typeof (req.body.payload) !== 'string') {
        return res.status(400).json({
            err: new BadRequestError('signature, did, payload should be string').body
        })
    }

    let body = {
        signature: req.body.signature as string,
        did: req.body.did as string,
        payload: req.body.payload as string
    }

    const msgHash = utils.hashMessage(body.payload)
    const msgHashBytes = utils.arrayify(msgHash)
    const expectedAddress = body.did.split(':')[2]

    try {
        const recoveredAddress = utils.recoverAddress(
            msgHashBytes,
            body.signature,
        )

        if (recoveredAddress === expectedAddress) {
            res.status(200).end()
        } else {
            res.status(200).json({ err: {
                code: ErrorCode.SIGNATURE_DOES_NOT_MATCH,
                reason: 'Expected and actual public key differ',
                additionalInformation: {
                    expected: expectedAddress,
                    actual: recoveredAddress
                }
            } })
        }
    } catch (error) {
        res.status(400).json({ err: new SignatureCheckError().body })
    }
}
