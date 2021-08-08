import { config } from "config"

type Auth = {
    username: string
    password: string
}

export function getAuth(): Auth | undefined {
    if (config.auth?.username && config.auth?.password) {
        return config.auth as Auth
    }
    return
}
