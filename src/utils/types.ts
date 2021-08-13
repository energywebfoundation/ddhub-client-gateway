export type Result<T = boolean, E = Error> = {
    ok?: T
    err?: E
}

export type Option<T> = {
    some?: T
    none?: boolean
}

export type Identity = {
    address: string
    publicKey: string
    privateKey: string
    balance: BalanceState
}

export type Enrolment = {
    did: string
    state: EnrolmentState
}

export type Certificate = {
    clientId: string
    tenantId: string
    clientSecret: string
}

export type Storage = {
    identity?: Identity
    enrolment?: Enrolment
    certificate?: Certificate
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

export enum RoleState {
    NO_CLAIM = 'NO_CLAIM',
    AWAITING_APPROVAL = 'AWAITING_APPROVAL',
    APPROVED = 'APPROVED',
    NOT_WANTED = 'NOT_WANTED', // if gateway is not controlling message broker
}

export enum BalanceState {
    NONE = 'NONE',
    LOW = 'LOW',
    OK = 'OK'
}

export type EnrolmentState = {
    approved: boolean
    waiting: boolean
    roles: {
        user: RoleState
        messagebroker: RoleState
    }
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

export type EnrolmentManager = {
    /**
     * Decentralized Identifer (DID) belonging to gateway identity
     */
    did: string
    /**
     * Get enrolment status of the configured DID
     *
     * @returns individual state of messagebroker and user roles
     */
    getState: () => Promise<Result<EnrolmentState>>
    /**
     * Creates enrolment claims (messagebroker and user) for gateway identity
     *
     * @param state current state, retreived from getEnrolmentState
     * @returns ok (boolean) or error code
     */
    handle: (state: EnrolmentState) => Promise<Result>
    /**
     * Persists gateway identity to json file
     *
     * @returns ok (boolean) or error code
     */
    save: (state: EnrolmentState) => Promise<Result>
}
