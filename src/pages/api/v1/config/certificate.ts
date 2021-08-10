// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs/promises'
import path from 'path'
import { ErrorCode, Result } from '../../../../utils'
import { isAuthorized } from 'services/auth.service'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Result<boolean, string>>
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
}

async function forPOST(
    req: NextApiRequest,
    res: NextApiResponse<Result<boolean, string>>
) {
    const { clientId, tenantId, clientSecret } = req.body
    if (!clientId || !tenantId || !clientSecret) {
        return res.status(400).json({ err: 'clientId, tenantId, clientSecret all required' })
    }
    try {
        const filepath = path.join(process.cwd(), 'vc.cert')
        await fs.writeFile(filepath, `${clientId},${tenantId},${clientSecret}`)
        // here we could optionally restart the broker
        res.status(200).json({
            ok: true
        })
    } catch (err) {
        res.status(400).json({
            err: `Credentials invalid: ${err.message}`
        })
    }
}
