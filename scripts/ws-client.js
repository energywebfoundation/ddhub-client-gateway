const { base64 } = require('ethers/lib/utils')
const { client: Client } = require('websocket')

const auth = base64.encode(Buffer.from(`dev:pass`))

const ws = new Client()

ws.on('connectFailed', (err) => console.log(err.message))

ws.on('connect', (connection) => {
    connection.on('close', (code, err) => {
        console.log('Client closing:', code, err)
        process.exit(0)
    })
    connection.on('message', (message) => {
        console.log('Received new message')
        if (message.type === 'utf8') {
            console.log(
                JSON.stringify( // pretty print
                    JSON.parse(message.utf8Data)
                )
            )
        } else {
            console.log(
                JSON.stringify( // pretty print
                    JSON.parse(message.binaryData.toString('utf8')),
                    null,
                    2
                )
            )
        }
    })
})

ws.connect(
    'http://localhost:3000/events',
    'dsb-messages',
    undefined,
    { authorization: `Bearer ${auth}` }
)
