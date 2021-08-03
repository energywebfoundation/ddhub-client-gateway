import { config } from 'config'
import { joinUrl, Result } from "utils"

export async function getHealth(): Promise<Result<boolean, string>> {
    try {
        const url = joinUrl(config.dsb.baseUrl, 'health')
        const res = await fetch(url)
        if (res.status !== 200) {
            console.log('fetch health failed', res.status, res.statusText)
            throw Error(`${res.status} - ${res.statusText}`)
        }
        // see http://dsb-dev.energyweb.org/swagger/#/default/HealthController_check
        const data: { status: 'ok' | 'error', error: any } = await res.json()
        console.log('fetch health', data)
        if (data.status !== 'ok') {
            throw Error(`${res.status} - ${Object.keys(data.error)}`)
        }
        return { ok: true }
    } catch (err) {
        return { ok: false, err: err.message }
    }
}
