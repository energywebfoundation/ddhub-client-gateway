// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'
import { ErrorBody, ErrorCode, GatewayError, SendMessageResult, Result, UnknownError } from '../../../../utils'
import { isAuthorized } from '../../../../services/auth.service'
import { DsbApiService } from '../../../../services/dsb-api.service'
import { signPayload } from '../../../../services/identity.service'
// import { captureException, withSentry } from '@sentry/nextjs'
const FormData = require('form-data')

import formidable from 'formidable'
const fs = require('fs')

type Response = ({ transactionId: string }) | { err: ErrorBody }

const handler = async (req: NextApiRequest, res: NextApiResponse<Result<boolean, ErrorBody>>) => {
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

async function forPOST(req: NextApiRequest, res: NextApiResponse<Result<boolean, ErrorBody>>): Promise<void> {

  return new Promise((resolve) => {

    const form = new formidable.IncomingForm()

    form['uploadDir'] = __dirname
    form['keepExtensions'] = true
    form.parse(req, async (err, fields, files) => {
      try {

        if (err) {
          return err
        }

        const fileData = new FormData()
        const fileStream = await fs.createReadStream(files.file['filepath'])
        fileData.append('file', fileStream)
        fileData.append('fileName', fields.fileName)
        fileData.append('fqcn', fields.fqcn)
        fileData.append('signature', fields.signature)
        fileData.append('topicId', fields.topicId)

        const { ok: sent, err: uploadError } = await DsbApiService.init().uploadFile(fileData, fileData.getHeaders())

        if (!sent) {
          throw uploadError
        }

        return resolve(res.status(200).send({ ok: true }))
      }
      catch (err) {

        if (err instanceof GatewayError) {
          return resolve(res.status(err.statusCode ?? 500).send({ err: err.body }))
        } else {

          //@disabling sentry currently 

          /*const error = new UnknownError(err)
          if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true' && process.env.SENTRY_LOG_ERROR === 'true') {
            const error = new UnknownError(err)
            captureException(error)
          }*/

          return resolve(res.status(500).send({ err: new UnknownError(err).body }))
        }
      }
    })
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler
