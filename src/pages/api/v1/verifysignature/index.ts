import { NextApiRequest, NextApiResponse } from "next"
import { isAuthorized } from "../../../../services/auth.service"
import { Result, ErrorCode } from "../../../../utils"
import { utils } from 'ethers';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).end()
    }
    const authHeader = req.headers.authorization
    const { err } = isAuthorized(authHeader)
    if (!err) {
        return verifySignature(req, res);
    } else {
        if (err.message === ErrorCode.UNAUTHORIZED) {
            res.status(401)
            res.setHeader("WWW-Authenticate", "Basic realm=\"Authorization Required\"")
            res.end()
        } else {
            res.status(403).end()
        }
    }
};

async function verifySignature(
    req: NextApiRequest,
    res: NextApiResponse<Result<boolean, string>>
) {

    if (!req.body.signature || !req.body.did || !req.body.payload) {
        return res.status(400).json({ err: 'signature, did, payload all required' })
    }

    let body = {
        signature: req.body.signature as string,
        did: req.body.did as string,
        payload: req.body.payload as string
    };

    const msgHash = utils.hashMessage(body.payload);
    const msgHashBytes = utils.arrayify(msgHash);
    const expectedPublicKey = body.did.split(':')[2];

    try {
        const recoveredPublicKey = utils.recoverPublicKey(
            msgHashBytes,
            body.signature,
        );
        if (recoveredPublicKey === expectedPublicKey) {
            res.status(200).json({
                ok: true
            })
        } else {
            res.status(400).json({ err: 'SIGNATURE_NOT_VERIFIED' });
        }
    } catch (error) {
        res.status(400).json({ err: 'Signature not correct' });
    }
}