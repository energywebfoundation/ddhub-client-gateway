export enum HttpError {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export enum ErrorCode {
    // IDENTITY ERRORS
    ID_NO_PRIVATE_KEY = 'ID::NO_PRIVATE_KEY',
    ID_INVALID_PRIVATE_KEY = 'ID::INVALID_PRIVATE_KEY',
    ID_IAM_INIT_ERROR = 'ID::IAM_INIT_ERROR',
    ID_FETCH_CLAIMS_FAILED = 'ID::FETCH_CLAIMS_FAILED',
    ID_CREATE_MESSAGEBROKER_CLAIM_FAILED = 'ID::CREATE_MESSAGEBROKER_CLAIM_FAILED',
    ID_CREATE_USER_CLAIM_FAILED = 'ID::CREATE_USER_CLAIM_FAILED',
    ID_NO_DID = 'ID::NO_DID',
    ID_BALANCE_CHECK_FAILED = 'ID::BALANCE_CHECK_FAILED',
    ID_NO_BALANCE = 'ID::NO_BALANCE',
    ID_ALREADY_ENROLED = 'ID::ALREADY_ENROLED',

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
    WEB3_PROVIDER_ERROR = 'WEB3::PROVIDER_ERROR',

    // GENERAL ERRORS
    DISK_PERSIST_FAILED = 'ID::DISK_PERSIST_FAILED',
}

export const errorExplainer: { [key: string]: { status: number, text: string} } = {
    [ErrorCode.ID_NO_PRIVATE_KEY]: {
        status: 400,
        text: 'Private key not set'
    },
    [ErrorCode.ID_INVALID_PRIVATE_KEY]: {
        status: 400,
        text: 'Private key should be hex-encoded string',
    },
    [ErrorCode.ID_IAM_INIT_ERROR]: {
        status: 500,
        text: 'Failed to initialize account',
    },
    [ErrorCode.ID_FETCH_CLAIMS_FAILED]: {
        status: 500,
        text: 'Failed to fetch roles',
    },
    [ErrorCode.ID_CREATE_MESSAGEBROKER_CLAIM_FAILED]: {
        status: 500,
        text: 'Could not enrol as "messagebroker"',
    },
    [ErrorCode.ID_CREATE_USER_CLAIM_FAILED]: {
        status: 500,
        text: 'Could not enrol as "user"',
    },
    [ErrorCode.ID_NO_DID]: {
        status: 500,
        text: 'Could not retrieve or create DID for account',
    },
    [ErrorCode.DISK_PERSIST_FAILED]: {
        status: 500,
        text: 'Failed to save state',
    },
    [ErrorCode.ID_BALANCE_CHECK_FAILED]: {
        status: 500,
        text: 'Could not retrieve balance for acount',
    },
    [ErrorCode.ID_NO_BALANCE]: {
        status: 500,
        text:'Account has no funds'
    },
    [ErrorCode.ID_ALREADY_ENROLED]: {
        status: 400,
        text: 'DID has already been enroled'
    }
}

export class HttpApiError extends Error {
    constructor(
        public readonly statusCode: HttpError,
        errorCode: ErrorCode,
    ) {
        super(errorCode)
    }
}
