import { Server } from 'http'
import { client as WsClient, server as WsServer } from 'websocket'
import { WebSocketClient, WebSocketServer } from './websocket.service'


describe('WebSocketService', () => {

    describe('Server', () => {

        let server: Server

        beforeEach(() => {
            server = new Server()
            server.listen('5000')
            WebSocketServer.init(server, '/ws')
        })

        afterEach(() => {
            server.close()
        })


        it('should accept connections', (done) => {
            const ws = new WsClient()
            ws.on('connect', (conn) => {
                conn.close()
                done()
            })
            ws.on('connectFailed', done)
            ws.connect('ws://localhost:5000/ws', 'dsb-messages')
        })

        it('should reject connections on wrong path', () => {
            const ws = new WsClient()
            try {
                ws.connect('ws://localhost:5000/wss', 'dsb-messages')
            } catch (err) {
                expect(err.message).toContain('Not found')
            }
        })

        it('should reject connections on wrong protocol', () => {
            const ws = new WsClient()
            try {
                ws.connect('ws://localhost:5000/ws', 'dsb')
            } catch (err) {
                expect(err.message).toContain('Protocol not supported')
            }
        })

        it('should send a message', () => {
            // TODO
        })

    })

    describe('Client', () => {

        let httpServer: Server
        let server: WsServer

        beforeEach(() => {
            httpServer = new Server()
            httpServer.listen(3030)
            server = new WsServer({ httpServer })
            server.on('request', (req) => {
                req.accept('dsb-gateway')
            })
        })

        afterEach(() => {
            httpServer.close()
            server.shutDown()
        })

        it('should connect to server', async () => {
            const client = await WebSocketClient.init('http://localhost:3030/', 'dsb-gateway')
            client.close()
        })

    })
})
