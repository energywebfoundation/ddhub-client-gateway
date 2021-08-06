import { HttpApiError } from "./errors"

export type Result<T = boolean, E = Error> = {
    ok?: T
    err?: E
}

export type Option<T> = {
    some?: T
    none?: Boolean
}

export enum StringType {
    STANDARD,
    HEX,
    HEX_COMPRESSED,
    DID
}

export enum DsbControlType {
    PM2 = 'pm2'
}

export enum RoleState {
    NO_CLAIM,
    AWAITING_APPROVAL,
    APPROVED,
    NOT_WANTED, // if gateway is not controlling message broker
}

export enum BalanceState {
    NONE = 'NONE',
    LOW = 'LOW',
    OK = 'OK'
}

export type EnrolmentState = {
    ready: boolean
    user: RoleState
    messagebroker: RoleState
}

export type IdentityManager = {
    /**
     * Decentralized Identifer (DID) belonging to gateway identity
     */
    did: string
    /**
     * Public key of associated private key of gateway
     */
    publicKey: string
    /**
     * Reports the status of the balance (i.e. if the identity will be able to
     * pay for the transaction(s))
     */
    balance: BalanceState
    /**
     * Get enrolment status of the configured identity (private key)
     *
     * @returns individual state of messagebroker and user roles
     */
    getEnrolmentState: () => Promise<Result<EnrolmentState, HttpApiError>>
    /**
     * Creates enrolment claims (messagebroker and user) for gateway identity
     *
     * @param state current state, retreived from getEnrolmentState
     * @returns ok (boolean) or error code
     */
    handleEnrolement: (state: EnrolmentState) => Promise<Result<boolean, HttpApiError>>
    /**
     * Persists gateway identity to json file
     *
     * @returns ok (boolean) or error code
     */
    writeToFile: (state: EnrolmentState) => Promise<Result<boolean, HttpApiError>>
}

export type SendMessageData = {
    fcqn: string
    payload: string
    signature: string
}

export type SendMessageResult = {
    id: string
}

export type GetMessageOptions = {
    fqcn: string
    amount?: number
}

export type Message = {
    id: string
    payload: string
    sender: string
    signature: string
}
