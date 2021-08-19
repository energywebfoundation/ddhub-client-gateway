// https://nextjs.org/docs/advanced-features/custom-server
// https://levelup.gitconnected.com/set-up-next-js-with-a-custom-express-server-typescript-9096d819da1c
import next from 'next'
import { createServer } from 'http'
import { parse } from 'url'
import { config } from './config'
import { WebSocketClientOptions, WebSocketImplementation } from './utils'
import { WebSocketClient, WebSocketServer } from './services/websocket.service'
import { DsbApiService } from './services/dsb-api.service'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const main = async () => {
    await app.prepare()

    const server = createServer((req, res) => {
        if (!req.url) {
            return res.end()
        }
        const parsedUrl = parse(req.url, true)
        handle(req, res, parsedUrl)
    })

    if (config.server.websocket === WebSocketImplementation.SERVER) {
        const ws = WebSocketServer.init(server, '/events')
        console.log('WebSocket available on /events')
        DsbApiService.init().pollForNewMessages((message) => ws.emit(message))
    } else if (config.server.websocket === WebSocketImplementation.CLIENT) {
        if (config.server.websocketClient?.url) {
            const ws = await WebSocketClient.init(
                config.server.websocketClient as WebSocketClientOptions
            )
            console.log('WebSocket client connected to', config.server.websocketClient.url)
            DsbApiService.init().pollForNewMessages((message) => ws.emit(message))
        } else {
            console.log('Need URL to connect to WebSocket Server. Skipping...')
        }
    }

    server.listen(config.server.port, () => {
        console.log(`Server listening on port ${config.server.port}`)
    })
}

main()
