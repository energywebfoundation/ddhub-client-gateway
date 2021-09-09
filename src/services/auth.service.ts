import { config } from "../config"
import { ErrorCode, Result } from "../utils"

type Auth = {
    username: string
    password: string
}

function getAuth(): Auth | undefined {
    if (config.auth?.username && config.auth?.password) {
        return config.auth as Auth
    }
    return
}

export function isAuthorized(authHeader?: string): Result<boolean, Error> {
    const auth = getAuth()
    if (!auth) {
        return { ok: true }
    }
    const token = authHeader?.split(" ").pop()
    if (!token) {
        return { err: new Error(ErrorCode.UNAUTHORIZED) }
    }
    const credentials = Buffer.from(token, "base64").toString("ascii")
    if (credentials !== `${auth.username}:${auth.password}`) {
        return { err: new Error(ErrorCode.FORBIDDEN) }
    }
    return { ok: true }
}
