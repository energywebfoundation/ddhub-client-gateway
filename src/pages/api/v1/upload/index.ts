// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'
import { ErrorCode } from '../../../../utils'
import { isAuthorized } from '../../../../services/auth.service'
import { DsbApiService } from '../../../../services/dsb-api.service'
import { signPayload } from '../../../../services/identity.service'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Response>
) {
    if (req.method !== 'POST') {
        return res.status(405).end()
    }
    const authHeader = req.headers.authorization
    const { err } = isAuthorized(authHeader)
    if (!err) {
        return forPOST(req, res)
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

async function forPOST(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {

    const payload = req.body.split('\n')[4] //taking only the content of the file from the request body

    const { ok: signature, err: signError } = await signPayload(payload)

    if (!signature) {
        return res.status(400).send({ err: signError })
    }
    let body = { fqcn: req.query.fqcn as string, payload: payload }

    const { ok: sent, err: sendError } = await DsbApiService.init().sendMessage({
        ...body,
        correlationId: uuidv4(),
        signature
    })

    if (!sent) {
        return res.status(400).send({ err: sendError })
    }
    return res.status(200).send(sent)

}
