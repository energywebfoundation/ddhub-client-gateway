const {IAM, setCacheClientOptions, NATS_EXCHANGE_TOPIC} = require('iam-client-lib')
const {Wallet} = require('ethers')

const privateKey = require('../in-memory.json').identity.privateKey
const { JSONCodec, connect } = require('nats.ws')

globalThis.WebSocket = require('websocket').w3cwebsocket

console.log('privateKey:', privateKey)

const { address } = new Wallet(privateKey)
console.log('address:', address)

const iam = new IAM({
    rpcUrl: 'https://volta-rpc.energyweb.org/',
    privateKey
})

setCacheClientOptions(73799, { url: 'https://identitycache-dev.energyweb.org/' })

iam.initializeConnection({ initCacheServer: true }).then(
    async (init) => {
        console.log('isConnected:', iam.isConnected())
        console.log('did:', iam.getDid())

        const claims = await iam.getClaimsByRequester({
            did: iam.getDid(),
            parentNamespace: 'dsb.apps.energyweb.iam.ewc'
        })
        console.log('claims', claims.map(({ id, claimType, isAccepted }) => ({
            id,
            claimType,
            isAccepted
        })))

        const url = 'wss://https://identityevents-dev.energyweb.org/'
        console.log('connecting to', url)
        const nc = await connect({ servers: url })
        console.log('connected')
        const jc = JSONCodec()
        const sub = nc.subscribe(`${iam.getDid()}.${NATS_EXCHANGE_TOPIC}`)

        for await (const m of sub) {
            console.log('Got message from topic')
            console.log('Message:', jc.decode(m.data))
        }

    }
).catch(console.error)
