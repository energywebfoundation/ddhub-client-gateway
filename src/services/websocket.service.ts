import { Server } from 'http'
import {
    IBinaryMessage,
    IUtf8Message,
    server as WsServer,
    client as WsClient,
    connection as WsClientConnection,
} from 'websocket'
import { GatewayError, Message, SendMessageData, WebSocketClientOptions } from '../utils'
import { isAuthorized } from './auth.service'
import { DsbApiService } from './dsb-api.service'
import { signPayload } from './identity.service'

/**
 * Parse a websocket message into our domain transfer object (message request)
 *
 * @param message the UTF-8 or binary message from the WS connection
 * @returns Message DTO
 */
const parseMessage = (message: IUtf8Message | IBinaryMessage): SendMessageData => {
    if (message.type === 'utf8') {
        return JSON.parse(message.utf8Data)
    }
    return JSON.parse(message.binaryData.toString())
}

/**
 * WebSocket server implementation (singleton)
 */
export class WebSocketServer {
    private static instance?: WebSocketServer
    private readonly ws: WsServer

    /**
     * WebSocket Protocol spoken by the server
     */
    protocol = 'dsb-messages'

    /**
     * Instantiate an instance or retrieve existing instance of the server
     *
     * @param server http server to use
     * @param path url path to listen for WS connections
     */
    static init(server: Server, path: string): WebSocketServer {
        if (this.instance) {
            return this.instance
        }
        this.instance = new WebSocketServer(server, path)
        return this.instance
    }

    /**
     * Get the server instance
     */
    static get(): WebSocketServer {
        if (!this.instance) {
            throw Error('Server not initialized yet!')
        }
        return this.instance
    }

    static destroy() {
        this.instance = undefined
    }

    constructor(server: Server, public path: string) {
        this.ws = new WsServer({ httpServer: server })
        this.ws.on('request', (req) => {
            // must be requesting {path} e.g. /events
            if (req.resource !== this.path) {
                return req.reject(404)
            }
            // must agree on the ws protocol
            if (!req.requestedProtocols.includes(this.protocol)) {
                return req.reject(400, 'Protocol Not Supported')
            }
            // must be authorized using basic auth
            const { err } = isAuthorized(req.httpRequest.headers.authorization)
            if (err) {
                return req.reject(401)
            }

            // accept connection request and listen for messages
            const connection = req.accept('dsb-messages')
            connection.on('message', async (data) => {
                const message = parseMessage(data)
                const { ok, err } = await DsbApiService.init().sendMessage(message)
                if (!ok) {
                    connection.send(JSON.stringify({
                        correlationId: message.correlationId,
                        err: err?.body
                    }))
                }
            })
        })
    }

    /**
     * Send message(s) to active connections (we can assume that each connection
     * is authorized to receive the message so we broadcast instead of unicast)
     *
     * @param message message(s) as pulled/received from DSB message broker
     */
    emit(message: Message | Message[]) {
        this.ws.broadcast(JSON.stringify(message))
    }
}

/**
 * WebSocket client implementation (singleton)
 */
export class WebSocketClient {
    private static instance?: WebSocketClient

    private retryCount = 0

    /**
     * Instantiate an instance or retrieve the existing client instance
     *
     * @param url of websocket server the client should connect to
     * @param protocol the websocket server speaks
     * @returns
     */
    static async init(options: WebSocketClientOptions): Promise<WebSocketClient> {
        if (this.instance) {
            return this.instance
        }
        return new Promise((resolve, reject) => {
            const ws = new WsClient()
            ws.on('connectFailed', reject)
            ws.on('connect', (connection) => {
                const client = new WebSocketClient(
                    ws,
                    connection,
                    options)
                this.instance = client
                resolve(client)
            })
            try {
                ws.connect(options.url, options.protocol)
            } catch (err) {
                reject(err)
            }
        })
    }

    /**
     * Get the client instance
     */
    static get(): WebSocketClient {
        if (!this.instance) {
            throw Error('Client not initialized yet!')
        }
        return this.instance
    }

    static destroy() {
        this.instance = undefined
    }

    constructor(
        private readonly ws: WsClient,
        private connection: WsClientConnection,
        private options: WebSocketClientOptions
    ) {
        this.connection.on('error', async (err) => {
            this.reconnect({ err: err.message })
        })
        this.connection.on('close', async (code, err) => {
            this.reconnect({ err, code })
        })
        this.connection.on('message', async (data) => {
            // todo: better parser
            const message = parseMessage(data)
            try {
                const { ok: signature, err: signError } = await signPayload(message.payload)
                if (!signature) {
                    throw signError
                }
                const { ok: sent, err: sendError } = await DsbApiService.init().sendMessage({
                    ...message,
                    signature
                })
                if (!sent) {
                    throw sendError
                }
            } catch (err) {
                if (message.correlationId) {
                    if (err instanceof GatewayError) {
                        this.connection.send(JSON.stringify({
                            correlationId: message.correlationId,
                            err: err.body
                        }))
                    } else {
                        this.connection.send(JSON.stringify({
                            correlationId: message.correlationId,
                            err: err instanceof Error ? err.message : err
                        }))
                    }
                }
            }
        })
    }

    isConnected(): Boolean {
        return this.connection.connected
    }

    /**
     * Sends message(s) to the server
     *
     * @param message message DTO(s) as retreived from the DSB message broker
     */
    emit(message: Message | Message[]) {
        this.connection.send(Buffer.from(JSON.stringify(message)))
    }

    /**
     * End the client connection
     */
    close() {
        this.options.reconnect = false
        this.connection.close()
    }

    private async reconnect(reason?: { err: string, code?: number }): Promise<void> {
        if (!this.canReconnect()) {
            return
        }
        if (reason) {
            console.log('WebSocket Client error:', reason.code, reason.err)
        }
        console.log(`WebSocket Client attempting reconnect [${this.retryCount}]...`)
        return new Promise((resolve) => {
            this.ws.on('connectFailed', (err) => {
                console.log('WebSocket Client failed to reconnect:', err.message)
                this.reconnect()
            })
            this.ws.on('connect', (connection) => {
                this.update(connection)
                resolve()
            })
            const timeout = this.options.reconnectTimeout ?? 10 * 1000
            setTimeout(() => {
                this.ws.connect(this.options.url, this.options.protocol)
                this.retryCount += 1
            }, timeout)
        })
    }

    private update(connection: WsClientConnection) {
        this.retryCount = 0
        this.connection = connection
    }

    private canReconnect(): Boolean {
        if (!this.options.reconnect) {
            return false
        }
        const maxRetries = this.options.reconnectMaxRetries ?? 10
        return this.retryCount < maxRetries
    }
}
