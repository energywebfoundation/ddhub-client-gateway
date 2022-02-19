// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ErrorBody, ErrorCode, GatewayError, Result, UnknownError } from '../../../../utils'
import { isAuthorized } from '../../../../services/auth.service'
import { DsbApiService } from '../../../../services/dsb-api.service'

type Response = ({ data: string }) | { err: ErrorBody }

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    if (req.method !== 'GET') {
        return res.status(405).end()
    }
    const authHeader = req.headers.authorization
    const { err } = isAuthorized(authHeader)
    if (!err) {
        return forGET(req, res)
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

async function forGET(req: NextApiRequest, res: NextApiResponse<Response>): Promise<void> {

    console.log('download file called')

    try {

        const { ok: fileData, err: downloadError } = await DsbApiService.init().downloadFile(req.query.fileId as string)

        if (!fileData) {
            throw downloadError
        }

        return res.status(200).send({
            data: fileData
        })
    }
    catch (err) {

        console.log(err)

        if (err instanceof GatewayError) {
            return res.status(err.statusCode ?? 500).send({ err: err.body })
        } else {
            return res.status(500).send({ err: new UnknownError(err).body })
        }
    }
}


export default handler
