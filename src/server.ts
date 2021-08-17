// https://nextjs.org/docs/advanced-features/custom-server
// https://levelup.gitconnected.com/set-up-next-js-with-a-custom-express-server-typescript-9096d819da1c
import next from 'next'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { parse } from 'url'
import { isAuthorized } from './services/auth.service'
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

    const io = new Server(server)

    io.use((socket, next) => {
        const token = socket.handshake.auth.bearer
        const { err } = isAuthorized(`Bearer ${token}`)
        next(err)
    })

    io.on('message', DsbApiService.init().sendMessage)

    const channels = [
        'test.channels.testapp.apps.testorganization.iam.ewc'
    ]
    setInterval(async () => {
        for (const fqcn of channels) {
            const { ok: messages } = await DsbApiService.init().getMessages({ fqcn })
            for (const message of messages ?? []) {
                // todo: filter sender
                io.emit(fqcn, message)
            }
        }

    }, 1000)

    server.listen(process.env.PORT ?? 3000, () => {
        console.log('Server listening on port 3000')
    })
}

main()
