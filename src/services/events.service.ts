import { config } from 'config'
import { EventEmitter } from 'events'
import { IAM, NATS_EXCHANGE_TOPIC } from 'iam-client-lib'
import { IClaimIssuance } from 'iam-client-lib/dist/src/iam'
import { Claim } from 'iam-client-lib/dist/src/cacheServerClient/cacheServerClient.types'
import { connect, JSONCodec } from 'nats.ws'
import { w3cwebsocket } from 'websocket'
import { MESSAGEBROKER_ROLE, RoleState, USER_ROLE } from 'utils'
import { initMessageBroker } from './dsb.service'
import { isApproved } from './identity.service'
import { getEnrolment, getIdentity, writeEnrolment } from './storage.service'

// shim websocket for nats.ws
globalThis.WebSocket = w3cwebsocket as any

export const events = new EventEmitter()

events.on('await_approval', async (iam: IAM) => {
    const state = {
        approved: false,
        waiting: true,
        roles: {
            user: RoleState.AWAITING_APPROVAL,
            messagebroker: RoleState.AWAITING_APPROVAL
        }
    }

    console.log('Connecting to', config.iam.eventServerUrl)
    const nc = await connect({ servers: `wss://${config.iam.eventServerUrl}` })
    console.log('Connected to identity server')

    const did = iam.getDid()
    const topic = `${iam.getDid()}.${NATS_EXCHANGE_TOPIC}`
    console.log('Listening for role approvals on', topic)

    const jc = JSONCodec<IClaimIssuance>()

    // 1h timeout - needs to be restarted (see catch block)
    const sub = nc.subscribe(topic)

    try {
        for await (const m of sub) {
            const claim = jc.decode(m.data)
            const count = sub.getProcessed()
            console.log(`[${count}] Received identity event: ${JSON.stringify(claim, null, 2)}`)
            if (claim.requester !== did) {
                continue
            }
            if (claim.issuedToken) {
                console.log(`[${count}] Received claim has been issued`)

                const decodedToken = await iam.decodeJWTToken({
                    token: claim.issuedToken
                }) as { [key: string]: Claim }

                if (decodedToken.claimData.claimType === USER_ROLE) {
                    console.log(`[${count}] Received issued claim is ${USER_ROLE}`)
                    await iam.publishPublicClaim({ token: claim.issuedToken })
                    console.log(`[${count}] Synced ${USER_ROLE} claim to DID Document`)
                    state.roles.user = RoleState.APPROVED
                }
                if (config.dsb.controllable && claim.id === MESSAGEBROKER_ROLE) {
                    console.log(`[${count}] Received issued claim is ${MESSAGEBROKER_ROLE}`)
                    await iam.publishPublicClaim({ token: claim.issuedToken })
                    console.log(`[${count}] Synced ${MESSAGEBROKER_ROLE} claim to DID Document`)
                    state.roles.messagebroker = RoleState.APPROVED
                }
            }
            if (state.roles.user === RoleState.APPROVED) {
                if (config.dsb.controllable && state.roles.messagebroker !== RoleState.APPROVED) {
                    // wait for approval
                    continue
                }
                if (sub) {
                    console.log('All roles have been approved and synced to DID Document')
                    state.approved = isApproved(state)
                    state.waiting = false
                    await writeEnrolment({ state, did: claim.requester })
                    events.emit('approved')
                    await nc.drain()
                }
            }
        }
    } catch (err) {
        // restart subscription
        console.log('Got subscription error. Restarting...')
        events.emit('await_approval', iam)
    }
})

events.on('approved', async () => {
    // TODO: it could be the case that there was no subscription at the time of
    // claim approval (see event above) - in such a case the subject would need
    // to manually sync the document in Switchboard. We could check here whether
    // the claim has been synced to the document and do so if not.
    console.log('Running approved enrolment job')
    const { some: identity } = await getIdentity()
    if (!identity) {
        return
    }
    const { some: enrolment } = await getEnrolment()
    if (!enrolment) {
        return
    }
    console.log('Starting message broker...')
    await initMessageBroker({
        privateKey: identity.privateKey,
        did: enrolment.did
    })
})
