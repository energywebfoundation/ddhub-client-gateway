// PM2 config file declaring processes
// DSB Message Broker not part of this as it is managed by the gateway (if allowed)
module.exports = {
    apps: [{
        name: 'dsb-client-gateway',
        script: 'yarn start',
        cwd: './dsb-client-gateway',
        interpreter: '/usr/bin/env'
    }]
}
