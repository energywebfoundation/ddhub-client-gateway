import { config } from "../config"
import {
    ErrorCode,
    GetMessageOptions,
    joinUrl,
    Message,
    Result,
    SendMessageData,
    SendMessageResult,
    EventEmitMode,
    Channel
} from "../utils"
import { signProof } from "./identity.service"
import { getEnrolment } from "./storage.service"

export class DsbApiService {

    private static instance?: DsbApiService
    private authToken?: string

    /**
     * Initialize the DsbAPIService
     *
     * @returns DsbApiService singleton
     */
    public static init(): DsbApiService {
        if (!DsbApiService.instance) {
            DsbApiService.instance = new DsbApiService()
        }
        return DsbApiService.instance
    }

    /**
     * Performs health check on DSB Message Broker
     *
     * @returns true if up
     */
    public async getHealth(): Promise<Result> {
        const url = joinUrl(config.dsb.baseUrl, 'health')
        let res: Response
        try {
            res = await fetch(url)
        } catch (err) {
            console.log('DSB /health error:', err.message)
            return { err: new Error(ErrorCode.DSB_REQUEST_FAILED) }
        }
        if (res.status !== 200) {
            console.log('DSB /health error', res.status, res.statusText)
            return { err: new Error(ErrorCode.DSB_REQUEST_FAILED) }
        }
        // see http://dsb-dev.energyweb.org/swagger/#/default/HealthController_check
        const data: { status: 'ok' | 'error', error: any } = await res.json()
        if (data.status !== 'ok') {
            console.log('DSB reporting unhealthy:', JSON.stringify(data.error))
            return { err: new Error(ErrorCode.DSB_UNHEALTHY) }
        }
        return { ok: true }
    }

    /**
     * Sends a POST /message request to the broker
     *
     * @returns
     */
    public async sendMessage(data: SendMessageData): Promise<Result<SendMessageResult>> {
        try {
            if (!this.authToken) {
                throw Error(ErrorCode.DSB_UNAUTHORIZED)
            }
            const url = joinUrl(config.dsb.baseUrl, 'message')
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            switch (res.status) {
                case 201:
                    return { ok: { id: await res.text() } }
                case 401:
                    throw Error(ErrorCode.DSB_UNAUTHORIZED)
                default:
                    console.log('DSB POST /message error', res.status, res.statusText)
                    throw Error(ErrorCode.DSB_REQUEST_FAILED)
            }
        } catch (err) {
            if (err.message === ErrorCode.DSB_UNAUTHORIZED) {
                const { ok, err } = await this.login()
                if (!ok) {
                    return { err }
                }
                return this.sendMessage(data)
            }
            return { err: err.message }
        }
    }

    public async getMessages(options: GetMessageOptions): Promise<Result<Message[]>> {
        try {
            if (!this.authToken) {
                throw Error(ErrorCode.DSB_UNAUTHORIZED)
            }
            const url = joinUrl(
                config.dsb.baseUrl,
                `message?fqcn=${options.fqcn}${options.amount ? `&amount=${options.amount}` : ''}`
            )
            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                },
            })
            switch (res.status) {
                case 200:
                    return { ok: await res.json() }
                case 401:
                    throw Error(ErrorCode.DSB_UNAUTHORIZED)
                case 403:
                    throw Error(ErrorCode.DSB_FORBIDDEN)
                default:
                    console.log('DSB GET /message error', res.status, res.statusText)
                    throw Error(ErrorCode.DSB_REQUEST_FAILED)
            }
        } catch (err) {
            if (err.message === ErrorCode.DSB_UNAUTHORIZED) {
                const { ok, err } = await this.login()
                console.log('ok', ok)
                if (!ok) {
                    console.log('login failed:', err?.message)
                    return { err }
                }
                return this.getMessages(options)
            }
            console.log('returning error')
            return { err: err }
        }
    }

    /**
     * Gets the list of channels that the gateway has publish/subscribe rights to
     *
     * @returns list of channels
     */
    public async getChannels(): Promise<Result<Channel[]>> {
        try {
            if (!this.authToken) {
                throw Error(ErrorCode.DSB_UNAUTHORIZED)
            }
            const url = joinUrl(config.dsb.baseUrl, `/channel/pubsub`)
            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                },
            })
            switch (res.status) {
                case 200:
                    return { ok: await res.json() }
                case 401:
                    throw Error(ErrorCode.DSB_UNAUTHORIZED)
                case 403:
                    throw Error(ErrorCode.DSB_FORBIDDEN)
                default:
                    console.log('DSB GET /message error', res.status, res.statusText)
                    throw Error(ErrorCode.DSB_REQUEST_FAILED)
            }
        } catch (err) {
            if (err.message === ErrorCode.DSB_UNAUTHORIZED) {
                const { ok, err } = await this.login()
                if (!ok) {
                    return { err }
                }
                return this.getChannels()
            }
            return { err }
        }
    }

    /**
     * Start polling for new messages on the DSB message broker. Note that this
     * will begin consuming from a channel/topic queue so it might take a while
     * to catch up to real-time.
     *
     * @param fqcn
     * @param callback
     */
    public async pollForNewMessages(
        callback: (message: Message | Message[]) => void
    ): Promise<Result> {
        const { some: enrolment } = await getEnrolment()
        if (!enrolment?.state.approved) {
            return { err: new Error(ErrorCode.ID_NOT_ENROLED) }
        }
        const { ok: channels, err: fetchErr } = await this.getChannels()
        if (!channels) {
            console.log('Error fetching available channels', fetchErr?.message)
            return { err: fetchErr }
        }
        const subscriptions = channels.filter(
            ({ subscribers }) => subscribers?.includes(enrolment.did)
        )
        if (subscriptions.length === 0) {
            console.log(
                'No subscriptions found. Restart once the DID has been added to a channel to enable push messages'
            )
            return { err: new Error(ErrorCode.DSB_NO_SUBSCRIPTIONS) }
        }

        console.log('Starting listener for messages in', channels.map((channel) => channel.fqcn))
        const interval = setInterval(async () => {
            for (const sub of subscriptions) {
                const { ok: messages, err } = await this.getMessages({
                    fqcn: sub.fqcn,
                    amount: config.events.maxPerSecond
                })
                if (err) {
                    console.log('Could not start listener for new messages, reason:', err.message)
                    clearInterval(interval)
                    break
                }
                if (messages && messages?.length > 0) {
                    console.log(`Received new messages - count: ${messages.length}`)
                    if (config.events.emitMode === EventEmitMode.BULK) {
                        return callback(
                            messages.map((msg) => ({ ...msg, fqcn: sub.fqcn }))
                        )
                    }
                    for (const message of messages) {
                        callback({
                            ...message,
                            fqcn: sub.fqcn
                        })
                    }
                }
            }
        }, 1000)
        return { ok: true }
    }

    /**
     * Prove identity to DSB Message Broker
     *
     * @returns token (JWT Bearer Auth Token)
     */
    private async login(): Promise<Result<string>> {
        const { ok: identityToken, err: proofError } = await signProof()
        if (!identityToken) {
            return { err: proofError }
        }
        try {
            const url = joinUrl(config.dsb.baseUrl, '/auth/login')
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ identityToken })
            })
            if (res.status !== 200) {
                console.log('DSB Login request failed:', res.status, res.statusText)
                throw Error(ErrorCode.DSB_REQUEST_FAILED)
            }
            const data: { token: string } = await res.json()
            // todo: verify signature
            this.authToken = data.token
            return { ok: data.token }
        } catch (err) {
            return { err: err.message }
        }
    }
}
