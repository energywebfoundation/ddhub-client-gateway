import { Server } from 'http'
import {
    IBinaryMessage,
    IUtf8Message,
    server as WsServer,
    client as WsClient,
    connection as WsClientConnection,
} from 'websocket'
import { Message, SendMessageData } from '../utils'
import { DsbApiService } from './dsb-api.service'

const parseMessage = (message: IUtf8Message | IBinaryMessage): SendMessageData => {
    if (message.type === 'utf8') {
        return JSON.parse(message.utf8Data)
    }
    return JSON.parse(message.binaryData.toString())
}

export class WebSocketServer {
    private static instance: WebSocketServer
    private readonly ws: WsServer

    protocol = 'dsb-messages'

    static init(server: Server, path: string): WebSocketServer {
        if (this.instance) {
            return this.instance
        }
        return new WebSocketServer(server, path)
    }

    static get(): WebSocketServer {
        if (!this.instance) {
            throw Error('Server not initialized yet!')
        }
        return this.instance
    }

    constructor(server: Server, public path: string) {
        this.ws = new WsServer({ httpServer: server })
        this.ws.on('request', (req) => {
            if (req.resource === this.path) {
                // todo: check auth
                if (req.requestedProtocols.includes(this.protocol)) {
                    const connection = req.accept('dsb-messages')
                    connection.on('message', async (data) => {
                        const message = parseMessage(data)
                        await DsbApiService.init().sendMessage(message)
                    })
                } else {
                    console.log('rejecting 400')
                    req.reject(400, 'Protocol not supported')
                }
            } else {
                console.log('rejecting 404')
                req.reject(404, 'Not found')
            }
        })
    }

    emit(message: Message) {
        this.ws.broadcast(Buffer.from(JSON.stringify(message)))
    }
}

export class WebSocketClient {
    private static instance: WebSocketClient

    static async init(url: string, protocol: string): Promise<WebSocketClient> {
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
        protocol: string) {
            this.connection.on('error', async () => this.reconnect(url, protocol))
            this.connection.on('close', async () => this.reconnect(url, protocol))
            this.connection.on('message', async (data) => {
                const message = parseMessage(data)
                await DsbApiService.init().sendMessage(message)
            })
    }

    emit(message: Message) {
        this.connection.send(Buffer.from(JSON.stringify(message)))
    }

    close() {
        this.connection.close()
    }

    private async reconnect(url: string, protocol: string): Promise<void> {
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

export class WebSocketClientConnection {

}
