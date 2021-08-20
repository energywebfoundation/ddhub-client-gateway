import { NextApiRequest, NextApiResponse } from "next"
import { isAuthorized } from "../../../../services/auth.service"
import { DsbApiService } from "../../../../services/dsb-api.service"
import { ErrorCode } from "../../../../utils"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).end()
    }
    const authHeader = req.headers.authorization
    const { err } = isAuthorized(authHeader)
    if (!err) {
        const { ok: channels, err: fetchErr } = await DsbApiService.init().getChannels()
        if (!channels) {
            return { err: fetchErr?.message }
        }
        return res.status(200).send(channels)
    } else {
        if (err.message === ErrorCode.UNAUTHORIZED) {
            res.status(401)
            res.setHeader("WWW-Authenticate", "Basic realm=\"Authorization Required\"")
            res.end()
        } else {
            res.status(403).end()
        }
    }
}
