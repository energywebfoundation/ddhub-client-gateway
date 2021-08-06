export enum HttpError {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export enum ErrorCode {
    // IDENTITY ERRORS
    NO_PRIVATE_KEY = 'ID::NO_PRIVATE_KEY',
    INVALID_PRIVATE_KEY = 'ID::INVALID_PRIVATE_KEY',
    IAM_INIT_ERROR = 'ID::IAM_INIT_ERROR',
    FETCH_CLAIMS_FAILED = 'ID::FETCH_CLAIMS_FAILED',
    CREATE_MESSAGEBROKER_CLAIM_FAILED = 'ID::CREATE_MESSAGEBROKER_CLAIM_FAILED',
    CREATE_USER_CLAIM_FAILED = 'ID::CREATE_USER_CLAIM_FAILED',
    NO_DID = 'ID::NO_DID',
    DISK_PERSIST_FAILED = 'ID::DISK_PERSIST_FAILED',
    BALANCE_CHECK_FAILED = 'ID::BALANCE_CHECK_FAILED',
    NO_BALANCE = 'ID::NO_BALANCE',

    // DSB ERRORS
    DSB_NOT_CONTROLLABLE = 'DSB::NOT_CONTROLLABLE',
    DSB_UNSUPPORTED_CONTROL_TYPE = 'DSB::UNSUPPORTED_CONTROL_TYPE',
    DSB_REQUEST_FAILED = 'DSB::REQUEST_FAILED',
    DSB_LOGIN_FAILED = 'DSB::LOGIN_FAILED',
    DSB_UNAUTHORIZED = 'DSB::UNAUTHORIZED',

    // PM2 ERRORS
    PM2_NOT_CONFIGURED = 'PM2::NOT_CONFIGURED',
    PM2_CONNECT_FAILED = 'PM2::CONNECT_FAILED',
    PM2_DISCONNECT_FAILED = 'PM2::DISCONNECT_FAILED',
    PM2_START_FAILED = 'PM2::START_FAILED',
    PM2_RESTART_FAILED = 'PM2::RESTART_FAILED',

    // WEB3 ERRORS
    WEB3_PROVIDER_ERROR = 'WEB3::PROVIDER_ERROR'
}

export const errorText = {
    [ErrorCode.NO_PRIVATE_KEY]: 'Please enter a private key',
    [ErrorCode.INVALID_PRIVATE_KEY]: 'Invalid private key',
    [ErrorCode.IAM_INIT_ERROR]: 'Failed to initialize account',
    [ErrorCode.FETCH_CLAIMS_FAILED]: 'Failed to fetch roles',
    [ErrorCode.CREATE_MESSAGEBROKER_CLAIM_FAILED]: 'Could not enrol as "messagebroker"',
    [ErrorCode.CREATE_USER_CLAIM_FAILED]: 'Could not enrol as "user"',
    [ErrorCode.NO_DID]: 'Account has no DID',
    [ErrorCode.DISK_PERSIST_FAILED]: 'Failed to persist credentials',
    [ErrorCode.BALANCE_CHECK_FAILED]: 'Could not retrieve balance',
    [ErrorCode.NO_BALANCE]: 'Account has no funds'
}

export class HttpApiError extends Error {
    constructor(
        public readonly statusCode: HttpError,
        errorCode: ErrorCode,
    ) {
        super(errorCode)
    }
}
