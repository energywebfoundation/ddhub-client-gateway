import { Server } from 'http'
import {
    IBinaryMessage,
    IUtf8Message,
    server as WsServer,
    client as WsClient,
    connection as WsClientConnection,
} from 'websocket'
import { Message, SendMessageData } from '../utils'
import { isAuthorized } from './auth.service'
import { DsbApiService } from './dsb-api.service'

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
    private static instance: WebSocketServer
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
        return new WebSocketServer(server, path)
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
                    connection.send(this.toBytes({
                        correlationId: message.correlationId,
                        err: err?.message
                    }))
                }
            })
        })
    }

    /**
     * Send a message to active connections (we can assume that each connection
     * is authorized to receive the message so we broadcast instead of unicast)
     *
     * @param message message as pulled/received from DSB message broker
     */
    emit(message: Message & { fqcn: string }) {
        this.ws.broadcast(this.toBytes(message))
    }

    private toBytes(data: object) {
        return Buffer.from(JSON.stringify(data))
    }
}

/**
 * WebSocket client implementation (singleton)
 */
export class WebSocketClient {
    private static instance: WebSocketClient

    /**
     * Instantiate an instance or retrieve the existing client instance
     *
     * @param url of websocket server the client should connect to
     * @param protocol the websocket server speaks
     * @returns
     */
    static async init(url: string, protocol?: string): Promise<WebSocketClient> {
        if (this.instance) {
            return this.instance
        }
        return new Promise((resolve, reject) => {
            const ws = new WsClient()
            ws.on('connect', (connection) => {
                const client = new WebSocketClient(ws, connection, url, protocol)
                resolve(client)
            })
            try {
                ws.connect(url, protocol)
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

    constructor(
        private readonly ws: WsClient,
        private connection: WsClientConnection,
        url: string,
        protocol?: string) {
            this.connection.on('error', async () => this.reconnect(url, protocol))
            this.connection.on('close', async () => this.reconnect(url, protocol))
            this.connection.on('message', async (data) => {
                const message = parseMessage(data)
                await DsbApiService.init().sendMessage(message)
            })
    }

    /**
     * Sends a message to the server
     *
     * @param message a message DTO as retreived from the DSB message broker
     */
    emit(message: Message) {
        this.connection.send(Buffer.from(JSON.stringify(message)))
    }

    /**
     * End the client connection
     */
    close() {
        this.connection.close()
    }

    private async reconnect(url: string, protocol?: string): Promise<void> {
        return new Promise((resolve) => {
            this.ws.on('connect', (connection) => {
                this.update(connection)
                resolve()
            })
            this.ws.connect(url, protocol)
        })
    }

    private update(connection: WsClientConnection) {
        this.connection = connection
    }
}
