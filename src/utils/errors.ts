export enum HttpError {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export enum ErrorCode {
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
