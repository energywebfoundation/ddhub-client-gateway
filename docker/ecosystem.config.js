// PM2 config file declaring processes
// DSB Message Broker not part of this as it is managed by the gateway (if allowed)
module.exports = {
    apps: [
        {
            name: 'dsb-client-gateway',
            script: 'yarn start',
            cwd: './dsb-client-gateway',
            interpreter: '/usr/bin/env'
        },
        {
            name: 'dsb-message-broker',
            script: './bin/dsb-message-broker',
            cwd: './dsb-message-broker',
            env: {
                PORT: '3001',
                PRIVATE_KEY: '0x50928deda44b8b6246423b6a4d6565b9258a3d8a3b83bfadb33aa847a2a9daf8',
                MB_DID: 'did:ethr:0x060bBD9eAd992124035B6F928e85766e03629886',
                JWT_SECRET: 'secret'
            }
        }
    ]
}
