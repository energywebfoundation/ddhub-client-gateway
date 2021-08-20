import { promises as fs } from 'fs'
import { join } from 'path'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const path = join(process.cwd(), 'public/ws.yaml')
        const file = await fs.readFile(path, 'utf-8')
        res.status(200).setHeader('Content-Type', 'application/yaml')
        res.send(file)
    } catch (err) {
        console.log(err)
        res.status(500).end()
    }
}
