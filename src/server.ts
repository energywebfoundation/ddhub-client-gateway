// import express from 'express'
import next from 'next'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { parse } from 'url'

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
    io.on('connection', (socket) => {
        console.log('got connection event')

        socket.on('disconnect', (reason) => {
            console.log('got disconnect event:', reason)
        })
    })

    server.listen(process.env.PORT ?? 3000, () => {
        console.log('Server listening on port 3000')
    })
}

main()
