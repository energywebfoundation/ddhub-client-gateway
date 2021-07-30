// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Wallet } from 'ethers'
import fs from 'fs/promises'
import path from 'path'
import { Result } from '../../../../utils'

type Data = {
    did: string
    publicKey: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Result<Data, string>>
) {
    const { privateKey } = req.body
    if (!privateKey) {
        return res.status(400).json({ err: 'privateKey required' })
    }
    try {
        const { address, publicKey } = new Wallet(privateKey)
        const did = `did:ethr:${address}`
        const filepath = path.join(process.cwd(), 'ewc.prv')
        await fs.writeFile(filepath, `${did},${publicKey},${privateKey}`)
        // here we could optionally restart the broker
        res.status(200).json({
            ok: {
                did,
                publicKey
            }
        })
    } catch (err) {
        res.status(400).json({
            err: `privateKey invalid: ${err.message}`
        })
    }
}
