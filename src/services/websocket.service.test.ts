import { base64 } from 'ethers/lib/utils'
import { Server } from 'http'
import { EventEmitter } from 'events'
import { client as WsClient, IBinaryMessage, IUtf8Message, server as WsServer } from 'websocket'
import { SendMessageData, WebSocketClientOptions } from '../utils'
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
                    const msg = parseMessage(data)
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
                    expect(msg.err).toBeDefined()
                    conn.close()
                    done()
                })
                conn.send(Buffer.from(JSON.stringify(payload)))
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

        const  protocol = 'dsb-gateway'

        const defaults = {
            url: 'http://localhost:3030/',
            protocol,
            reconnect: false
        }

        const events = new EventEmitter()

        beforeEach(() => {
            httpServer = new Server()
            httpServer.listen(3030)
            server = new WsServer({ httpServer })
            server.on('request', (req) => {
                if (!req.requestedProtocols.includes(protocol)) {
                    return req.reject()
                }
                const conn = req.accept(protocol)
                conn.on('message', (data) => {
                    const msg: any = parseMessage(data)
                    if (msg.fqcn) {
                        events.emit(`${msg.fqcn}#${msg.id}`, msg)
                    } else if (msg.correlationId) {
                        events.emit(msg.correlationId, msg)
                    }
                })
            })
        })

        afterEach(() => {
            httpServer.close()
            server.shutDown()
        })

        it('should connect to server on particular protocol', (done) => {
            WebSocketClient.init(defaults)
                .then((client) => {
                    client.close()
                    done()
                })
        })

        it('should return error if url not available', (done) => {
            const options = { ...defaults, url: 'http://localhost:3031/' }
            WebSocketClient.init(options)
                .then((client) => {
                    client.close()
                    done('Should not connect!')
                })
                .catch((err) => {
                    expect(err.message).toContain('ECONNREFUSED')
                    done()
                })
        })

        it('should return error if protocol not supported', (done) => {
            const options = { ...defaults, protocol: undefined }
            WebSocketClient.init(options)
                .then((client) => {
                    client.close()
                    done('Should not connect!')
                })
                .catch((err) => {
                    expect(err.message).toContain('403 Forbidden')
                    done()
                })
        })

        it('should send a message to the server', (done) => {
            WebSocketClient.init(defaults)
                .then((client) => {
                    const payload = {
                        id: '1',
                        fqcn: 'test.channel',
                        payload: '<payload>',
                        sender: 'did:ethr:<address>',
                        signature: 'signed'
                    }
                    events.on(`${payload.fqcn}#${payload.id}`, (msg) => {
                        expect(msg).toEqual(payload)
                        client.close()
                        done()
                    })
                    client.emit(payload)
                })
        })

        it('should receive a message from the server', (done) => {
            WebSocketClient.init(defaults)
                .then((client) => {
                    if (server.connections.length !== 1) {
                        throw Error('Server should have exactly 1 connection')
                    }
                    const payload: SendMessageData = {
                        fqcn: 'my.channel',
                        payload: '<test_payload>',
                        correlationId: '456',
                        signature: 'signed by me'
                    }
                    events.on(payload.correlationId, (msg) => {
                        expect(msg.correlationId).toBe(payload.correlationId)
                        expect(msg.err).toBeDefined()
                        client.close()
                        done()
                    })
                    server.connections[0].send(Buffer.from(JSON.stringify(payload)))
                })

        })

        it('should attempt to reconnect on server close', (done) => {
            const options: WebSocketClientOptions = {
                ...defaults,
                reconnect: true,
                reconnectTimeout: 500,
                reconnectMaxRetries: 1
            }
            WebSocketClient.init(options)
                .then((client) => {
                    expect(client.isConnected()).toBe(true)
                    server.closeAllConnections()

                    // wait 200ms to be sure state has changed
                    setTimeout(() => {
                        expect(client.isConnected()).toBe(false)
                        // wait a further 500ms for reconnect
                        setTimeout(() => {
                            expect(client.isConnected()).toBe(true)
                            client.close()
                            done()
                        }, 500)
                    }, 200)
                })
        })
    })
})
