import type { NextApiRequest, NextApiResponse } from 'next'
import { DsbApiService } from 'services/dsb-api.service'
import { signPayload } from 'services/identity.service'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET':
            return res.status(501).end()
        case 'POST':
            const { ok: signature, err: signError } = await signPayload(req.body.payload)
            if (!signature) {
                return res.status(400).send({ err: signError })
            }
            const { ok: sent, err: sentError } = await DsbApiService.init().sendMessage({
                ...req.body,
                signature
            })
            if (!sent) {
                return res.status(400).send({ err: sentError })
            }
            return res.status(200).send(sent)
        default:
            return res.status(405).end()
    }
}

