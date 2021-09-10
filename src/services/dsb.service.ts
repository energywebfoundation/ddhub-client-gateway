import { config } from '../config'
import { DsbControlType, ErrorCode, Result } from '../utils'
import { initPM2, ProcessState } from './pm2.service'

type MessageBrokerOptions = {
  privateKey: string
  did: string
}

/**
 * Setup and control the DSB Message Broker with configured process manager.
 * Requires DSB_CONTROLLABLE to be set to 'true'
 *
 * @param options DSB Message Broker config options
 * @returns true if process managed successfully
 */
export async function initMessageBroker(options: MessageBrokerOptions): Promise<Result<boolean, Error>> {
  if (!config.dsb.controllable) {
    return { err: new Error(ErrorCode.DSB_NOT_CONTROLLABLE) }
  }
  switch (config.dsb.controlType) {
    case DsbControlType.PM2:
      return usingPM2(options)
    default:
      return { err: new Error(ErrorCode.DSB_UNSUPPORTED_CONTROL_TYPE) }
  }
}

async function usingPM2({ privateKey, did }: MessageBrokerOptions): Promise<Result<boolean, Error>> {
  if (!config.dsb.pm2) {
    return { err: new Error(ErrorCode.PM2_NOT_CONFIGURED) }
  }
  console.log('Starting message broker via PM2')
  const { processName, dsbBinPath } = config.dsb.pm2
  const { ok: pm2, err: initError } = await initPM2()
  if (!pm2) {
    return { err: initError }
  }
  const { ok: state, err: stateError } = await pm2.isRunning(processName)
  if (state === undefined) {
    pm2.done()
    return { err: stateError }
  }
  const options = {
    name: processName,
    script: dsbBinPath,
    env: {
      PRIVATE_KEY: privateKey,
      MB_DID: did,
      JWT_SECRET: 'secret', // TODO
      PORT: '3001'
    }
  }
  if (state === ProcessState.NONE) {
    const result = await pm2.start(options)
    pm2.done()
    return result
  }
  const result = await pm2.restart(options)
  pm2.done()
  return result
}
