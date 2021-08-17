import path from 'path'
import { DsbControlType } from '../utils/types'

const defaults = {
    chainId: '73799',
    rpcUrl: 'https://volta-rpc.energyweb.org/',
    cacheServerUrl: 'https://identitycache-dev.energyweb.org/',
    eventServerUrl: 'https://identityevents-dev.energyweb.org/',
    inMemoryDbFilename: 'in-memory.json',
    parentNamespace: 'dsb.apps.energyweb.iam.ewc',
    dsbBaseUrl: 'http://dsb-dev.energyweb.org',
    dsbProcessName: 'dsb-message-broker',
    dsbBinPath: '../dsb-message-broker/bin/dsb-message-broker'
}

const takeIf = <T>(requirement?: any, subject?: T): T | undefined =>
    requirement ? subject : undefined

const asBool = (some?: string) => some ? (some === 'true') : false

export const config = {
    iam: {
        chainId: parseInt(process.env.CHAIN_ID ?? defaults.chainId, 10),
        rpcUrl: process.env.RPC_URL ?? defaults.rpcUrl,
        cacheServerUrl: process.env.CACHE_SERVER_URL ?? defaults.cacheServerUrl,
        eventServerUrl: process.env.EVENT_SERVER_URL ?? defaults.eventServerUrl,
        parentNamespace:
            process.env.PARENT_NAMESPACE ?? defaults.parentNamespace
    },
    storage: {
        inMemoryDbFile: path.join(
            process.cwd(),
            process.env.IN_MEMORY_DB_FILENAME ?? defaults.inMemoryDbFilename
        )
    },
    dsb: {
        baseUrl: process.env.DSB_BASE_URL ?? defaults.dsbBaseUrl,
        controllable: asBool(process.env.DSB_CONTROLLABLE),
        controlType: takeIf(
            process.env.DSB_CONTROLLABLE,
            process.env.DSB_CONTROL_TYPE),
        pm2: takeIf(process.env.DSB_CONTROL_TYPE === DsbControlType.PM2, {
            processName: process.env.DSB_PM2_PROCESS_NAME ?? defaults.dsbProcessName,
            dsbBinPath: process.env.DSB_PM2_BIN_PATH ?? defaults.dsbBinPath
        })
    },
    auth: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
    }
}
