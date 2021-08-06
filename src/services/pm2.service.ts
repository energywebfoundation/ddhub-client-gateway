import { config } from 'config'
import pm2, { StartOptions } from 'pm2'
import { ErrorCode, Result } from 'utils'

type PM2 = {
    /**
     * Checks if the process with the given name is running
     *
     * @param name name of the process to validate
     * @returns process state (NONE, ONLINE, NOT_ONLINE)
     */
    isRunning: (name: string) => Promise<Result<ProcessState>>
    /**
     * Starts a new PM2 process with the given options
     *
     * @param options StartOptions
     * as per https://pm2.keymetrics.io/docs/usage/application-declaration/#attributes-available
     * @returns true if started successfully
     */
    start: (options: StartOptions) => Promise<Result>
    /**
     * Restarts a PM2 process with the given options. For example:
     *
     * @example
     * // already have a process started called "foo" but want to change the ENV
     * await pm2.restart({
     *   name: "foo",
     *   script: "./scripts/foo.js",
     *   env: {
     *     VARIABLE: "changed"
     *   }
     * })
     *
     * @param options StartOptions
     * as per https://pm2.keymetrics.io/docs/usage/application-declaration/#attributes-available
     * @returns true if started successfully
     */
    restart: (options: StartOptions) => Promise<Result>
    /**
     * Call this once finished to disconnect from the PM2 daemon
     *
     * @returns true if disconnected successfully
     */
    done: () => Result
}

export enum ProcessState {
    NONE,
    ONLINE,
    NOT_ONLINE,
}

export async function initPM2(): Promise<Result<PM2>> {
    return new Promise((resolve) => {
        pm2.connect((err) => {
            if (err) {
                console.log(`Failed to connect to PM2: ${err.message}`)
                resolve({ err: new Error(ErrorCode.PM2_CONNECT_FAILED) })
            }
            resolve({
                ok: {
                    isRunning: async (name: string) => new Promise((resolve) => {
                        pm2.describe(name, (err, description) => {
                            if (err) {
                                console.log(`Failed to run PM2 describe: ${err.message}`)
                                return resolve({ err: new Error(ErrorCode.PM2_CONNECT_FAILED) })
                            }
                            // process does not exist
                            if (description.length === 0) {
                                return resolve({ ok: ProcessState.NONE })
                            }
                            // process is not online (stopped, errored, etc)
                            if (description[0].pm2_env?.status !== 'online') {
                                return resolve({ ok: ProcessState.NOT_ONLINE })
                            }
                            // is ruunning: needs to be restarted
                            // todo: don't restart if private key already set (?)
                            return resolve({ ok: ProcessState.ONLINE })
                        })
                    }),
                    start: async (options: StartOptions) => new Promise((resolve) => {
                        pm2.start(options, (err) => {
                            if (err) {
                                resolve({ err: new Error(ErrorCode.PM2_START_FAILED) })
                            }
                            resolve({ ok: true })
                        })
                    }),
                    restart: async (options: StartOptions) => new Promise((resolve) => {
                        // pm2 does accept options for the first arg even if types suggest otherwise
                        pm2.restart(options as unknown as string, (err) => {
                            if (err) {
                                resolve({ err: new Error(ErrorCode.PM2_RESTART_FAILED) })
                            }
                            resolve({ ok: true })
                        })
                    }),
                    done: () => {
                        try {
                            pm2.disconnect()
                            return { ok: true }
                        } catch (err) {
                            console.log(`Failed to disconnect from PM2 daemon: ${err.message}`)
                            return { err: new Error(ErrorCode.PM2_DISCONNECT_FAILED) }
                        }
                    }
                }
            })
        })
    })
}
