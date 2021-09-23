// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'
import { ErrorBody, ErrorCode, GatewayError, SendMessageResult, UnknownError } from '../../../../utils'
import { isAuthorized } from '../../../../services/auth.service'
import { DsbApiService } from '../../../../services/dsb-api.service'
import { signPayload } from '../../../../services/identity.service'
import { captureException, withSentry } from '@sentry/nextjs'

type Response = (SendMessageResult & { transactionId: string }) | { err: ErrorBody }

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
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
      res.setHeader('WWW-Authenticate', 'Basic realm="Authorization Required"')
      res.end()
    } else {
      res.status(403).end()
    }
  }
}

async function forPOST(req: NextApiRequest, res: NextApiResponse<Response>): Promise<void> {
  try {
    //taking only the content of the file from the request body
    const lines = (req.body as string).split('\n')
    const payload = lines
      .slice(3, lines.length - 2)
      .filter((line) => line !== '\r')
      .join('')

    const { ok: signature, err: signError } = await signPayload(payload)

    if (!signature) {
      throw signError
    }
    let body = {
      fqcn: req.query.fqcn as string,
      topic: req.query.topic as string,
      payload: payload
    }

    const transactionId = uuidv4()

    const { ok: sent, err: sendError } = await DsbApiService.init().sendMessage({
      ...body,
      transactionId,
      signature
    })

    if (!sent) {
      throw sendError
    }
    return res.status(200).send({ ...sent, transactionId })
  } catch (err) {
    if (err instanceof GatewayError) {
      res.status(err.statusCode ?? 500).send({ err: err.body })
    } else {
      const error = new UnknownError(err)
      if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true' && process.env.SENTRY_LOG_ERROR === 'true') {
        const error = new UnknownError(err)
        captureException(error)
      }
      res.status(500).send({ err: new UnknownError(err).body })
    }
  }
}
export default withSentry(handler)
