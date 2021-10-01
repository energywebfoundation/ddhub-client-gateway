// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ErrorCode} from '../../../../utils'
import { isAuthorized } from '../../../../services/auth.service'
import { withSentry } from '@sentry/nextjs'
import { DsbApiService } from '../../../../services/dsb-api.service'
import {
    errorOrElse
} from '../../../../utils'


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).end()
    }
    const authHeader = req.headers.authorization
    const { err } = isAuthorized(authHeader)
    if (!err) {
        return forGET(req, res)
    } else {
        if (err.message === ErrorCode.UNAUTHORIZED) {
            res.status(401)
            res.setHeader('WWW-Authenticate', 'Basic realm="Authorization Required"')
            res.end()
        } else {
            res.status(403).end()
        }
    }
}


async function forGET(req: NextApiRequest, res: NextApiResponse): Promise<void> {

    const { ok: messages, err: reqError } = await DsbApiService.init().getMessages(req.query as any)

    if (messages === undefined) {
        const error = errorOrElse(reqError)
        return res.status(error.statusCode).send({ err: error.body })
    }

    const payload = messages.map((message) => message.payload)

    return res.send(payload)
}


export default withSentry(handler)
