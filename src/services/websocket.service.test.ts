import { base64 } from 'ethers/lib/utils'
import { Server } from 'http'
import { client as WsClient, IBinaryMessage, IUtf8Message, server as WsServer } from 'websocket'
import { SendMessageData } from '../utils'
import { WebSocketClient, WebSocketServer } from './websocket.service'

const parseMessage = <T>(msg: IUtf8Message | IBinaryMessage): T => {
    if (msg.type === 'utf8') {
        return JSON.parse(msg.utf8Data)
    }
    return JSON.parse(msg.binaryData.toString('utf8'))
}

describe('WebSocketService', () => {

    describe('Server', () => {

        const authorization = `Bearer ${base64.encode(Buffer.from('test:password'))}`
        let server: Server
        let wsServer: WebSocketServer

        beforeEach(() => {
            server = new Server()
            server.listen('5000')
            wsServer = WebSocketServer.init(server, '/ws')
        })

        afterEach(() => {
            server.close()
        })

        it('should accept authorized connections', (done) => {
            const ws = new WsClient()
            ws.on('connect', (conn) => {
                conn.close()
                done()
            })
            ws.on('connectFailed', done)
            ws.connect(
                'ws://localhost:5000/ws',
                'dsb-messages',
                undefined,
                { authorization })
        })

        it('should not allow unauthorized clients to connect: missing auth', (done) => {
            const ws = new WsClient()
            ws.on('connect', () => done('Should not connect'))
            ws.on('connectFailed', (err) => {
                expect(err.message).toContain('401 Unauthorized')
                done()
            })
            ws.connect('ws://localhost:5000/ws', 'dsb-messages')
        })

        it('should not allow unauthorized clients to connect: wrong auth', (done) => {
            const ws = new WsClient()
            ws.on('connect', () => done('Should not connect'))
            ws.on('connectFailed', (err) => {
                expect(err.message).toContain('401 Unauthorized')
                done()
            })
            ws.connect(
                'ws://localhost:5000/ws',
                'dsb-messages',
                undefined,
                { authorization: `Bearer ${base64.encode(Buffer.from('dev:pass'))}` })
        })

        it('should reject connections on wrong path', (done) => {
            const ws = new WsClient()
            ws.on('connect', () => done('Should not connect'))
            ws.on('connectFailed', (err) => {
                expect(err.message).toContain('404 Not Found')
                done()
            })
            ws.connect('ws://localhost:5000/wss', 'dsb-messages')
        })

        it('should reject connections on wrong protocol', (done) => {
            const ws = new WsClient()
            ws.on('connect', () => done('Should not connect'))
            ws.on('connectFailed', (err) => {
                expect(err.message).toContain('400 Bad Request')
                expect(err.message).toContain('Protocol Not Supported')
                done()
            })
            ws.connect('ws://localhost:5000/ws', 'dsb')
        })

        it('should send a message to the client', (done) => {
            const ws = new WsClient()
            ws.on('connect', (conn) => {
                const payload = {
                    id: '1',
                    fqcn: 'test.channel',
                    payload: '<payload>',
                    sender: 'did:ethr:<address>',
                    signature: 'signed'
                }
                conn.on('message', (data) => {
                    const msg: SendMessageData & { fqcn: string } = parseMessage(data)
                    expect(msg).toEqual(payload)
                    conn.close()
                    done()
                })
                wsServer.emit(payload)
            })
            ws.on('connectFailed', done)
            ws.connect(
                'ws://localhost:5000/ws',
                'dsb-messages',
                undefined,
                { authorization })
        })

        it('should receive a message from the client', (done) => {
            const ws = new WsClient()
            ws.on('connect', (conn) => {
                const payload: SendMessageData = {
                    fqcn: 'test.channel',
                    payload: '<payload>',
                    correlationId: '123',
                    signature: 'signed'
                }
                conn.on('message', (data) => {
                    const msg: { correlationId: string, err: string } = parseMessage(data)
                    expect(msg.correlationId).toBe(payload.correlationId)
                    conn.close()
                    done()
                })
                conn.send(JSON.stringify(payload))
            })
            ws.on('connectFailed', done)
            ws.connect(
                'ws://localhost:5000/ws',
                'dsb-messages',
                undefined,
                { authorization })
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
