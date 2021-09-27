// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs/promises'
import Formidable, { File } from 'formidable'
import { ErrorBody, ErrorCode, Result, File as CertFile } from '../../../../utils'
import { isAuthorized } from '../../../../services/auth.service'
import { withSentry } from '@sentry/nextjs'
import { writeCertificate } from '../../../../services/storage.service'

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

async function forPOST(
  req: NextApiRequest,
  res: NextApiResponse<Result<boolean, ErrorBody>>
): Promise<void> {
  return new Promise((resolve) => {
    const form = Formidable()
    form.parse(req, async (parseErr, fields, files) => {
      try {
        if (parseErr) {
          throw parseErr
        }
        const cert = await parseFile(files.cert)
        if (!cert) {
          return resolve(res.status(400).send({
            err: {
              code: ErrorCode.INVALID_FILE,
              reason: 'Public certificate file not provided'
            }
          }))
        }
        const { err } = await writeCertificate({
          cert,
          key: await parseFile(files.key),
          ca: await parseFile(files.ca)
        })
        if (err) {
          throw err
        }
        resolve(res.status(200).send({ ok: true }))
      } catch (err) {
        resolve(res.status(400).send({
          err: {
            code: ErrorCode.DISK_WRITE_FAILED,
            reason: `Could not write: ${err instanceof Error ? err.message : err}`
          }
        }))
      }
    })
  })
}

const parseFile = async (file?: File | File[]): Promise<CertFile | undefined> => {
  if (!file) {
    return
  }
  const isFile = (file: File | File[]): file is File => {
    return (file as File).name ? true : false
  }
  if (!isFile(file)) {
    return
  }
  if (!file.name) {
    return
  }
  return {
    name: file.name,
    value: (await fs.readFile(file.path)).toString()
  }
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default withSentry(handler)
