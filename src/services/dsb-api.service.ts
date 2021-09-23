import { config } from '../config'
import {
  ErrorCode,
  GetMessageOptions,
  joinUrl,
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
  DSBChannelUnauthorizedError
} from '../utils'
import { signProof } from './identity.service'
import { getEnrolment } from './storage.service'
import { captureMessage } from '@sentry/nextjs'

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
      console.log('Connecting to', config.dsb.baseUrl)
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
    try {
      const res: Response = await fetch(url)
      const data: { status: 'ok' | 'error'; error: any } = await res.json()
      if (data.status !== 'ok') {
        return { err: new DSBHealthError(data.error) }
      }
      return { ok: true }
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
    try {
      if (!this.authToken) {
        throw Error(ErrorCode.DSB_UNAUTHORIZED)
      }
      const url = joinUrl(config.dsb.baseUrl, 'message')
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.translateIdempotencyKey(data, true))
      })
      switch (res.status) {
        case 201:
          if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true' && process.env.SENTRY_LOG_MESSAGE === 'true') {
            const messagePayload = {
              fcqn: data.fqcn,
              topic: data.topic,
              transactionId: data.transactionId,
              id: await res.text(),
            }
            captureMessage(JSON.stringify(messagePayload))
          }
          return { ok: { id: await res.text() } }
        case 400:
          const { message: payloadErrorMessage } = await res.json()
          throw new DSBPayloadError(payloadErrorMessage)
        case 401:
          const unauthorizedMessage = (await res.json()).message
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
          throw new DSBChannelNotFoundError((await res.json()).message)
        default:
          throw new DSBRequestError(`${res.status} ${res.statusText}`)
      }
    } catch (err) {
      return this.handleError(err, async () => this.sendMessage(data))
    }
  }

  public async getMessages(options: GetMessageOptions): Promise<Result<Message[]>> {
    try {
      let query = `fqcn=${options.fqcn}`
      query += options.amount ? `&amount=${options.amount}` : ''
      query += options.clientId ? `&clientId=${options.clientId}` : ''

      const url = joinUrl(config.dsb.baseUrl, `message?${query}`)
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      })
      switch (res.status) {
        case 200:
          if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true' && process.env.SENTRY_LOG_MESSAGE === 'true') {
            const messageResponsePayload = {
              query: query,
              messages: (await res.json()).map((msg: any) => this.translateIdempotencyKey(msg, false))
            }
            captureMessage(JSON.stringify(messageResponsePayload))
          }
          return {
            ok: (await res.json()).map((msg: any) => this.translateIdempotencyKey(msg, false))
          }
        case 401:
          // not logged in
          const unauthorizedMessage = (await res.json()).message
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
          throw new DSBChannelNotFoundError((await res.json()).message)
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
    try {
      const url = joinUrl(config.dsb.baseUrl, `/channel/pubsub`)
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      })
      switch (res.status) {
        case 200:
          return { ok: await res.json() }
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
      const url = joinUrl(config.dsb.baseUrl, '/auth/login')
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ identityToken })
      })
      if (res.status !== 200) {
        return { err: new DSBLoginError(`${res.status} ${res.statusText}`) }
      }
      const data: { token: string } = await res.json()
      // todo: verify signature
      this.authToken = data.token
      return { ok: data.token }
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
}
