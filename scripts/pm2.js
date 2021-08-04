const pm2 = require('pm2')

pm2.connect((err) => {
    if (err) {
        console.log('connect error:', err)
    }

    pm2.restart({
        name: 'bar',
        script: './scripts/test-proc.js',
        env: {
            NAME: 'eve'
        }
    }, (err) => {
        if (err) {
            console.log('error starting bar', err)
        }
        pm2.disconnect()
    })

})
