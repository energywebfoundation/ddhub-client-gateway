const {IAM, setCacheClientOptions} = require('iam-client-lib')
const {Wallet} = require('ethers')

const privateKey = require('../in-memory.json').identity.privateKey
console.log('privateKey:', privateKey)

const { address } = new Wallet(privateKey)
console.log('address:', address)

const iam = new IAM({
    rpcUrl: 'https://volta-rpc.energyweb.org/',
    privateKey
})

setCacheClientOptions(73799, { url: 'https://identitycache-dev.energyweb.org/' })

iam.initializeConnection().then(
    async () => {
        console.log('isConnected:', iam.isConnected())
        console.log('did:', iam.getDid())

        const claims = await iam.getClaimsByRequester({
            did: iam.getDid(),
            parentNamespace: 'dsb.apps.energyweb.iam.ewc'
        })
        console.log('claims', claims)
    }
).catch(console.error)
