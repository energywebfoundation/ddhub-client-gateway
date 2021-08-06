import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET':
            return res.status(501).end()
        case 'POST':
            return res.status(501).end()
        default:
            return res.status(405).end()
    }
}
