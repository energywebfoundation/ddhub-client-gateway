import { EventEmitter } from 'events'
import { initMessageBroker } from './dsb.service'
import { getEnrolment, getIdentity } from './storage.service'

export const events = new EventEmitter()

events.on('approved', async () => {
    console.log('onApproved init message broker')
    const { some: identity } = await getIdentity()
    if (!identity) {
        return
    }
    const { some: enrolment } = await getEnrolment()
    if (!enrolment) {
        return
    }
    await initMessageBroker({
        privateKey: identity.privateKey,
        did: enrolment.did
    })
})
