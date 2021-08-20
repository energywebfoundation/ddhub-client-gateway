// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { DsbApiService } from '../../services/dsb-api.service'
import { ErrorCode } from '../../utils'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { ok, err } = await DsbApiService.init().getHealth()
    if (!ok) {
      throw err ? err : new Error(ErrorCode.DSB_UNHEALTHY)
    }
    res.status(200).end()
  } catch (err) {
    res.status(503).send({ err: err.message })
  }
}
