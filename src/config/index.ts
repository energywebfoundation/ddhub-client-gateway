import { loadEnvConfig } from '@next/env'
import path from 'path'
import { DsbControlType } from '../utils/types'

// manually load config because we have a custom server
loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production')

const defaults = {
  port: '3000',
  websocket: 'NONE',
  chainId: '73799',
  rpcUrl: 'https://volta-rpc.energyweb.org/',
  cacheServerUrl: 'https://identitycache-dev.energyweb.org/',
  eventServerUrl: 'https://identityevents-dev.energyweb.org/',
  inMemoryDbFilename: 'in-memory.json',
  parentNamespace: 'dsb.apps.energyweb.iam.ewc',
  dsbBaseUrl: 'http://dsb-dev.energyweb.org',
  dsbProcessName: 'dsb-message-broker',
  dsbBinPath: '../dsb-message-broker/bin/dsb-message-broker',
  websocketReconnect: 'true',
  websocketReconnectTimeout: '10000',
  websocketReconnectMaxRetries: '10',
  eventsMode: 'BULK',
  eventsPerSecond: '100'
}

const takeIf = <T>(requirement?: any, subject?: T): T | undefined => (requirement ? subject : undefined)

const asBool = (some?: string) => (some ? some === 'true' : false)

const asEnum = (options: string[], some?: string) => (options.includes(some ?? '') ? some : undefined)

export const config = {
  server: {
    port: parseInt(process.env.PORT ?? defaults.port, 10),
    websocket: asEnum(['SERVER', 'CLIENT', 'NONE'], process.env.WEBSOCKET) ?? defaults.websocket,
    websocketClient: takeIf(process.env.WEBSOCKET === 'CLIENT', {
      url: process.env.WEBSOCKET_URL,
      protocol: process.env.WEBSOCKET_PROTOCOL,
      reconnect: asBool(process.env.WEBSOCKET_RECONNECT ?? defaults.websocketReconnect),
      reconnectTimeout: parseInt(process.env.WEBSOCKET_RECONNECT_TIMEOUT ?? defaults.websocketReconnectTimeout, 10),
      reconnectMaxRetries: parseInt(
        process.env.WEBSOCKET_RECONNECT_MAX_RETRIES ?? defaults.websocketReconnectMaxRetries,
        10
      )
    })
  },
  iam: {
    chainId: parseInt(process.env.CHAIN_ID ?? defaults.chainId, 10),
    rpcUrl: process.env.RPC_URL ?? defaults.rpcUrl,
    cacheServerUrl: process.env.CACHE_SERVER_URL ?? defaults.cacheServerUrl,
    eventServerUrl: process.env.EVENT_SERVER_URL ?? defaults.eventServerUrl,
    parentNamespace: process.env.PARENT_NAMESPACE ?? defaults.parentNamespace,
    privateKey: process.env.PRIVATE_KEY
  },
  storage: {
    inMemoryDbFile: path.join(process.cwd(), process.env.IN_MEMORY_DB_FILENAME ?? defaults.inMemoryDbFilename)
  },
  dsb: {
    baseUrl: process.env.DSB_BASE_URL ?? defaults.dsbBaseUrl,
    controllable: asBool(process.env.DSB_CONTROLLABLE),
    controlType: takeIf(process.env.DSB_CONTROLLABLE, process.env.DSB_CONTROL_TYPE),
    pm2: takeIf(process.env.DSB_CONTROL_TYPE === DsbControlType.PM2, {
      processName: process.env.DSB_PM2_PROCESS_NAME ?? defaults.dsbProcessName,
      dsbBinPath: process.env.DSB_PM2_BIN_PATH ?? defaults.dsbBinPath
    })
  },
  auth: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD
  },
  events: {
    emitMode: asEnum(['SINGLE', 'BULK'], process.env.EVENTS_EMIT_MODE) ?? defaults.eventsMode,
    maxPerSecond: parseInt(process.env.EVENTS_MAX_PER_SECOND ?? defaults.eventsPerSecond, 10)
  }
}
