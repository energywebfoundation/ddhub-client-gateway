import path from 'path'

const defaults = {
    chainId: '73799',
    rpcUrl: 'https://volta-rpc.energweb.org/',
    cacheServerUrl: 'https://identitycache-dev.energyweb.org/',
    inMemoryDbFilename: 'in-memory.json',
    parentNamespace: 'dsb.apps.energyweb.iam.ewc'
}

export const config = {
    iam: {
        chainId: parseInt(process.env.CHAIN_ID ?? defaults.chainId, 10),
        rpcUrl: process.env.RPC_URL ?? defaults.rpcUrl,
        cacheServerUrl: process.env.CACHE_SERVER_URL ?? defaults.cacheServerUrl,
        parentNamespace:
            process.env.PARENT_NAMESPACE ?? defaults.parentNamespace
    },
    storage: {
        inMemoryDbFile: path.join(
            process.cwd(),
            process.env.IN_MEMORY_DB_FILENAME ?? defaults.inMemoryDbFilename
        )
    }
}
