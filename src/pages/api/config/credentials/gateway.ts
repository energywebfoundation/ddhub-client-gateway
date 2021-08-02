// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Wallet } from 'ethers'
import fs from 'fs/promises'
import path from 'path'
import { Result } from '../../../../utils'
import { IAM, RegistrationTypes, setCacheClientOptions } from 'iam-client-lib'

const PARENT_NAMESPACE = 'dsb.apps.energyweb.iam.ewc'
const USER_ROLE = `user.roles.${PARENT_NAMESPACE}`
const MESSAGEBROKER_ROLE = `messagebroker.roles.${PARENT_NAMESPACE}`

type CheckEnrolmentRequirements = {
    iam: IAM
}

type HandleEnrolmentRequirements = {
    state: EnrolmentState
} & CheckEnrolmentRequirements

enum RoleStatus {
    NO_CLAIM,
    AWAITING_APPROVAL,
    APPROVED,
}

type EnrolmentState = {
    user: RoleStatus
    messagebroker: RoleStatus
}

type Data = {
    did: string
    publicKey: string
}

async function checkEnrolment({
    iam,
}: CheckEnrolmentRequirements): Promise<Result<EnrolmentState>> {
    try {
        const did = iam.getDid()
        if (!did) {
            throw Error('Need to create DID first')
        }
        // const doc = await iam.getDidDocument()
        console.log('pre-claims')
        const claims = (await iam.getClaimsBySubject({
            did,
            parentNamespace: PARENT_NAMESPACE,
        }))
        console.log('claims', claims)
        // cycle through claims to get overall enrolment status
        const state = {
            user: RoleStatus.NO_CLAIM,
            messagebroker: RoleStatus.NO_CLAIM
        }
        for (const { claimType, isAccepted } of claims) {
            if (claimType === MESSAGEBROKER_ROLE) {
                state.messagebroker = isAccepted
                ? RoleStatus.APPROVED
                : RoleStatus.AWAITING_APPROVAL
            }
            if (claimType === USER_ROLE) {
                state.user = isAccepted
                    ? RoleStatus.APPROVED
                    : RoleStatus.AWAITING_APPROVAL
            }
        }
        return { ok: state }
    } catch (err) {
        return { err }
    }
}

async function handleEnrolment({
    iam,
    state
}: HandleEnrolmentRequirements): Promise<Result> {
    if (state.messagebroker === RoleStatus.NO_CLAIM) {
        try {
            await iam.createClaimRequest({
                claim: {
                    claimType: MESSAGEBROKER_ROLE,
                    claimTypeVersion: 1,
                    fields: []
                },
                registrationTypes: [
                    RegistrationTypes.OnChain,
                    RegistrationTypes.OffChain
                ]
            })
        } catch (err) {
            return {
                err: new Error(`Failed to create messagebroker claim: ${err.mmessage}`)
            }
        }
    }
    if (state.user === RoleStatus.NO_CLAIM) {
        try {
            await iam.createClaimRequest({
                claim: {
                    claimType: USER_ROLE,
                    claimTypeVersion: 1,
                    fields: []
                },
                registrationTypes: [
                    RegistrationTypes.OnChain,
                    RegistrationTypes.OffChain,
                ]
            })
        } catch (err) {
            return {
                err: new Error(`Failed to create user claim: ${err.message}`)
            }
        }
    }
    return { ok: true }
}

// TODO: return relevant error messages to frontend
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Result<Data, string>>
) {
    const { privateKey } = req.body
    if (!privateKey) {
        return res.status(400).json({ err: 'privateKey required' })
    }
    try {
        const { address, publicKey } = new Wallet(privateKey)
        const iam = new IAM({
            privateKey,
            rpcUrl: 'https://volta-rpc.energyweb.org',
        })
        // todo: create DID
        console.log('pre-init', iam.getDid())
        await iam.initializeConnection()
        console.log('init', iam.getDid())

        setCacheClientOptions(73799, {
            url: 'https://identitycache-dev.energyweb.org/'
        })

        // handle dsb enrolment: is it complete?
        const { ok: state, err: queryError } = await checkEnrolment({ iam })
        if (!state) {
            throw queryError
        }
        console.log('enrolment state:', state)
        // await handleEnrolment({ iam, state })

        // persist the gateway identity
        const filepath = path.join(process.cwd(), 'ewc.prv')
        await fs.writeFile(filepath, `${iam.getDid()},${publicKey},${privateKey}`)

        // here we could optionally restart the broker

        res.status(200).json({
            ok: {
                did: iam.getDid() ?? address,
                publicKey
            }
        })
    } catch (err) {
        res.status(400).json({
            err: err.message
        })
    }
}
