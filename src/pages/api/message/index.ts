import type { NextApiRequest, NextApiResponse } from 'next'
import { DsbApiService } from 'services/dsb-api.service'
import { signPayload } from 'services/identity.service'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
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
 * Handles the GET /messages request
 */
async function forGET(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    // todo: validate request bodies/queries
    const { ok: messages, err: reqError } = await DsbApiService.init().getMessages(req.query as any)
    if (messages === undefined) {
        return res.status(500).send({ err: reqError })
    }
    return res.status(200).send(messages)
}

/**
 * Handles the POST /messages request
 */
async function forPOST(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    const { ok: signature, err: signError } = await signPayload(req.body.payload)
    if (!signature) {
        return res.status(400).send({ err: signError })
    }
    const { ok: sent, err: sendError } = await DsbApiService.init().sendMessage({
        ...req.body,
        signature
    })
    if (!sent) {
        return res.status(400).send({ err: sendError })
    }
    return res.status(200).send(sent)
}
