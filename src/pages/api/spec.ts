
import type { NextApiRequest, NextApiResponse } from 'next'
import spec from '../../../public/spec.json'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.status(200).json(spec)
}
