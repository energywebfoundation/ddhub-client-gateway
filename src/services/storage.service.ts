import { config } from 'config'
import { promises as fs } from 'fs'
import { ErrorCode, Result } from 'utils'
import { BalanceState, RoleState } from './identity.service'

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
        const { ok: storage, err: storageError } = await getStorage()
        if (!storage) {
            return { err: storageError }
        }
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
        const { ok: storage, err: storageError } = await getStorage()
        if (!storage) {
            return { err: storageError }
        }
        await fs.writeFile(
            config.storage.inMemoryDbFile,
            JSON.stringify({ ...storage, certificate }, null, 2))
        return { ok: true }
    } catch (err) {
        return { err: new Error(ErrorCode.DISK_PERSIST_FAILED) }
    }
}

export async function getStorage(): Promise<Result<Storage>> {
    try {
        const contents = await fs.readFile(config.storage.inMemoryDbFile, 'utf-8')
        return {
            ok: JSON.parse(contents)
        }
    } catch (err) {
        console.log('Error reading storage:', err.message)
        return { ok: {} }
    }
}
