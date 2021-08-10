import { config } from "config"
import { ErrorCode, GetMessageOptions, joinUrl, Message, Result, SendMessageData, SendMessageResult } from "utils"
import { signProof } from "./identity.service"

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
        // todo: check enrolment complete
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
                return this.getMessages(options)
            }
            return { err: err.message }
        }
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
