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
    DISK_PERSIST_FAILED = 'ID::DISK_PERSIST_FAILED'
}

export class HttpApiError extends Error {
    constructor(
        public readonly statusCode: HttpError,
        errorCode: ErrorCode,
    ) {
        super(errorCode)
    }
}
