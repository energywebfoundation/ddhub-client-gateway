// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Wallet } from 'ethers'
import fs from 'fs/promises'
import path from 'path'
import { Result } from '../../../../utils'

export default async function handler(
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
            err: `privateKey invalid: ${err.message}`
        })
    }
}
