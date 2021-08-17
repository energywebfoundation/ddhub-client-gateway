// https://nextjs.org/docs/advanced-features/custom-server
// https://levelup.gitconnected.com/set-up-next-js-with-a-custom-express-server-typescript-9096d819da1c
import next from 'next'
import { createServer } from 'http'
import { parse } from 'url'
import { config } from './config'
import { WebSocketImplementation } from './utils'
import { WebSocketClient, WebSocketServer } from './services/websocket.service'

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
        WebSocketServer.init(server, '/events')

    } else if (config.server.websocket === WebSocketImplementation.CLIENT) {
        // TODO: client config
        WebSocketClient.init('', '')
    }

    server.listen(config.server.port, () => {
        console.log(`Server listening on port ${config.server.port}`)
    })
}

main()
