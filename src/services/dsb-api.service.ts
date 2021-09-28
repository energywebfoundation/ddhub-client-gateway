import { config } from '../config'
import {
  ErrorCode,
  GetMessageOptions,
  Message,
  Result,
  SendMessageData,
  SendMessageResult,
  EventEmitMode,
  Channel,
  GatewayError,
  DSBRequestError,
  DSBHealthError,
  DSBPayloadError,
  DSBLoginError,
  DSBForbiddenError,
  DSBChannelNotFoundError,
  DSBChannelUnauthorizedError,
} from '../utils'
import { signProof } from './identity.service'
import { getCertificate, getEnrolment } from './storage.service'
import { captureMessage } from '@sentry/nextjs'
import { Agent } from 'https'
import axios, { AxiosInstance } from 'axios'

export class DsbApiService {
  private static instance?: DsbApiService
  private api: AxiosInstance
  private authToken?: string
  private httpsAgent?: Agent

  /**
   * Initialize the DsbAPIService
   *
   * @returns DsbApiService singleton
   */
  public static init(): DsbApiService {
    if (!DsbApiService.instance) {
      console.log('Connecting to', config.dsb.baseUrl)
      DsbApiService.instance = new DsbApiService()
    }
    return DsbApiService.instance
  }

  constructor() {
    this.api = axios.create({
      baseURL: config.dsb.baseUrl,
      validateStatus: () => true // no throw
    })
  }

  /**
   * In case TLS request does not work, reset
   */
  public removeTLS() {
    this.httpsAgent = undefined
  }

  /**
   * Performs health check on DSB Message Broker
   *
   * @returns true if up
   */
  public async getHealth(): Promise<Result> {
    await this.useTLS()
    try {
      const res = await this.api.get('/health', { httpsAgent: this.httpsAgent })
      if (res.status === 200) {
        const data: { status: 'ok' | 'error'; error: any } = res.data
        if (data.status !== 'ok') {
          return { err: new DSBHealthError(data.error) }
        }
        return { ok: true }
      }
      return {
        err: new DSBForbiddenError(`Cannot access message broker: ${res.status} ${res.statusText} - ${res.data}`)
      }
    } catch (err) {
      return {
        err: new DSBRequestError(err instanceof Error ? err.message : (err as any))
      }
    }
  }

  /**
   * Sends a POST /message request to the broker
   *
   * @returns
   */
  public async sendMessage(data: SendMessageData): Promise<Result<SendMessageResult>> {
    await this.useTLS()
    try {
      if (!this.authToken) {
        throw Error(ErrorCode.DSB_UNAUTHORIZED)
      }
      const res = await this.api.request({
        url: '/message',
        method: 'POST',
        httpsAgent: this.httpsAgent,
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(this.translateIdempotencyKey(data, true))
      })
      switch (res.status) {
        case 201:
          if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true' && process.env.SENTRY_LOG_MESSAGE === 'true') {
            const messagePayload = {
              fcqn: data.fqcn,
              topic: data.topic,
              transactionId: data.transactionId,
              id: res.data,
            }
            captureMessage(JSON.stringify(messagePayload))
          }
          return { ok: { id: res.data } }
        case 400:
          const { message: payloadErrorMessage } = await res.data
          throw new DSBPayloadError(payloadErrorMessage)
        case 401:
          const unauthorizedMessage = res.data.message
          // login error
          if (unauthorizedMessage === 'Unauthorized') {
            throw Error(ErrorCode.DSB_UNAUTHORIZED)
          }
          // channel not authorized
          else {
            throw new DSBChannelUnauthorizedError(unauthorizedMessage)
          }
        case 403:
          throw new DSBForbiddenError(`Must be enroled as a DSB user to access messages`)
        case 404:
          throw new DSBChannelNotFoundError(res.data.message)
        default:
          throw new DSBRequestError(`${res.status} ${res.statusText}`)
      }
    } catch (err) {
      return this.handleError(err, async () => this.sendMessage(data))
    }
  }

  public async getMessages(options: GetMessageOptions): Promise<Result<Message[]>> {
    await this.useTLS()
    try {
      if (!this.authToken) {
        throw Error(ErrorCode.DSB_UNAUTHORIZED)
      }
      const res = await this.api.get('/message', {
        params: options,
        httpsAgent: this.httpsAgent,
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      })
      switch (res.status) {
        case 200:
          const response = (res.data).map((msg: any) => this.translateIdempotencyKey(msg, false))

          if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true' && process.env.SENTRY_LOG_MESSAGE === 'true') {
            const messageResponsePayload = {
              query: options,
              messages: response
            }
            captureMessage(JSON.stringify(messageResponsePayload))
          }
          return {
            ok: response
          }
        case 401:
          // not logged in
          const unauthorizedMessage = res.data.message
          if (unauthorizedMessage === 'Unauthorized') {
            throw Error(ErrorCode.DSB_UNAUTHORIZED)
          }
          // cannot access channel
          else {
            throw new DSBChannelUnauthorizedError(unauthorizedMessage)
          }
        case 403:
          throw new DSBForbiddenError(`Must be enroled as a DSB user to access messages`)
        case 404:
          throw new DSBChannelNotFoundError(res.data.message)
        default:
          throw new DSBRequestError(`${res.status} ${res.statusText}`)
      }
    } catch (err) {
      return this.handleError(err, async () => this.getMessages(options))
    }
  }

  /**
   * Gets the list of channels that the gateway has publish/subscribe rights to
   *
   * @returns list of channels
   */
  public async getChannels(): Promise<Result<Channel[]>> {
    await this.useTLS()
    try {
      if (!this.authToken) {
        throw Error(ErrorCode.DSB_UNAUTHORIZED)
      }
      const res = await this.api.get('/channel/pubsub', {
        httpsAgent: this.httpsAgent,
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      })
      switch (res.status) {
        case 200:
          return { ok: res.data }
        case 401:
          throw Error(ErrorCode.DSB_UNAUTHORIZED)
        case 403:
          throw new DSBForbiddenError(`Must be enroled as a DSB user to access messages`)
        default:
          throw new DSBRequestError(`${res.status} ${res.statusText}`)
      }
    } catch (err) {
      return this.handleError(err, async () => this.getChannels())
    }
  }

  /**
   * Start polling for new messages on the DSB message broker. Note that this
   * will begin consuming from a channel/topic queue so it might take a while
   * to catch up to real-time.
   *
   * To be deleted once we have websocket support on the message broker
   *
   * @param fqcn
   * @param callback
   */
  public async pollForNewMessages(callback: (message: Message | Message[]) => void): Promise<void> {
    let interval = 60

    const job = async () => {
      // console.log(`Attempt to start listening for messages [${interval}s]`)
      const { some: enrolment } = await getEnrolment()
      if (!enrolment?.state.approved) {
        console.log('User not enroled. Waiting for enrolment... (60s)')
        interval = 60
        return
      }
      const { ok: channels, err: fetchErr } = await this.getChannels()
      if (!channels) {
        console.log('Error fetching available channels:', fetchErr?.message ? fetchErr.message : fetchErr)
        interval = 60
        return { err: fetchErr }
      }
      const subscriptions = channels.filter(
        // take by default, but if subscribers present check the list
        ({ subscribers }) => (subscribers ? subscribers?.includes(enrolment.did) : true)
      )
      if (subscriptions.length === 0) {
        console.log('No subscriptions found. Push messages are enabled when the DID is added to a channel... (60s)')
        interval = 60
        return { err: new Error(ErrorCode.DSB_NO_SUBSCRIPTIONS) }
      }

      interval = 1

      for (const sub of subscriptions) {
        const { ok: messages, err } = await this.getMessages({
          fqcn: sub.fqcn,
          amount: config.events.maxPerSecond,
          clientId: 'wsconsumer'
        })
        if (err) {
          console.log('Error fetching messages:', err.message)
          interval = 60
          break
        }
        if (messages && messages?.length > 0) {
          console.log(`Received new messages - count: ${messages.length}`)
          if (config.events.emitMode === EventEmitMode.BULK) {
            return callback(messages.map((msg) => ({ ...msg, fqcn: sub.fqcn })))
          }
          for (const message of messages) {
            callback({
              ...message,
              fqcn: sub.fqcn
            })
          }
        }
      }
    }
    // use setTimeout instead of setInterval so we can control the interval
    const runner = async () => {
      await job()
      setTimeout(runner, interval * 1000)
    }
    runner()
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
      const res = await this.api.request({
        url: '/auth/login',
        method: 'POST',
        httpsAgent: this.httpsAgent,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({ identityToken })
      })
      if (res.status !== 200) {
        return { err: new DSBLoginError(`${res.status} ${res.statusText}`) }
      }
      // todo: verify signature
      this.authToken = res.data.token
      return { ok: res.data.token }
    } catch (err) {
      return {
        err: new DSBRequestError(err instanceof Error ? err.message : (err as string))
      }
    }
  }

  private async handleError<T>(
    err: unknown,
    retryFn: () => Promise<Result<T, GatewayError>>
  ): Promise<Result<T, GatewayError>> {
    if (err instanceof GatewayError) {
      return { err }
    } else if (err instanceof Error) {
      if (err.message === ErrorCode.DSB_UNAUTHORIZED) {
        const { ok, err } = await this.login()
        if (!ok) {
          return { err }
        }
        return retryFn()
      }
      return {
        err: new DSBRequestError(err.message)
      }
    } else {
      return { err: new GatewayError(err as any) }
    }
  }

  /**
   * Translates the gateway's `transactionId` to message broker's `correlationId`
   * or vice versa
   *
   * @param body outgoing or incoming message
   * @param outgoing if message is outgoing (send to message broker)
   * @returns
   */
  private translateIdempotencyKey(body: { transactionId?: string; correlationId?: string }, outgoing: boolean): any {
    if (outgoing) {
      const correlationId = body.transactionId
      delete body.transactionId
      return {
        ...body,
        correlationId
      }
    } else {
      const transactionId = body.correlationId
      delete body.correlationId
      return {
        ...body,
        transactionId
      }
    }
  }

  /**
   * Loads client certificates
   */
  private async useTLS(): Promise<void> {
    if (this.httpsAgent) {
      return
    }
    const { some: tls } = await getCertificate()
    if (tls) {
      this.httpsAgent = new Agent({
        cert: tls.cert.value,
        key: tls.key?.value,
        ca: tls.ca?.value
      })
      console.log('loaded tls')
    }
  }
}
