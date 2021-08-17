import { Server } from 'http'
import { client, server } from 'websocket'
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
            const ws = new client()
            ws.on('connect', (conn) => {
                conn.close()
                done()
            })
            ws.on('connectFailed', done)
            ws.connect('ws://localhost:5000/ws', 'dsb-messages')
        })

        it('should reject connections on wrong path', () => {
            const ws = new client()
            try {
                ws.connect('ws://localhost:5000/wss', 'dsb-messages')
            } catch (err) {
                expect(err.message).toContain('Not found')
            }
        })

        it('should reject connections on wrong protocol', () => {
            const ws = new client()
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

        // TODO: write basic server impl.

        // TODO: write test case to connect to server using client

    })
})
