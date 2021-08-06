import { config } from 'config'
import { promises as fs } from 'fs'
import { BalanceState, ErrorCode, Option, Result, RoleState } from 'utils'

export type Identity = {
    did: string
    address: string
    publicKey: string
    privateKey: string
    balance: BalanceState
    state: {
        user: RoleState
        messagebroker: RoleState
    }
}

export type Certificate = {
    clientId: string
    tenantId: string
    clientSecret: string
}

export type Storage = {
    identity?: Identity
    certificate?: Certificate
}

export async function writeIdentity(identity: Identity): Promise<Result> {
    try {
        const { some: storage } = await getStorage()
        await fs.writeFile(
            config.storage.inMemoryDbFile,
            JSON.stringify({...storage, identity}, null, 2))
        return { ok: true }
    } catch (err) {
        return { err: new Error(ErrorCode.DISK_PERSIST_FAILED) }
    }
}

export async function writeCertificate(certificate: Certificate): Promise<Result> {
    try {
        const { some: storage } = await getStorage()
        await fs.writeFile(
            config.storage.inMemoryDbFile,
            JSON.stringify({ ...storage, certificate }, null, 2))
        return { ok: true }
    } catch (err) {
        return { err: new Error(ErrorCode.DISK_PERSIST_FAILED) }
    }
}

export async function getStorage(): Promise<Option<Storage>> {
    try {
        const contents = await fs.readFile(config.storage.inMemoryDbFile, 'utf-8')
        return {
            some: JSON.parse(contents)
        }
    } catch (err) {
        console.log('Error reading storage:', err.message)
        return { none: true }
    }
}

export async function getIdentity(): Promise<Option<Identity>> {
    const { some: storage } = await getStorage()
    if (storage && storage.identity) {
        return { some: storage.identity }
    }
    return { none: true }
}
