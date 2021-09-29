export enum HttpError {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503
}

export enum ErrorCode {
  // IDENTITY ERRORS
  ID_NO_PRIVATE_KEY = 'ID::NO_PRIVATE_KEY',
  ID_INVALID_PRIVATE_KEY = 'ID::INVALID_PRIVATE_KEY',
  ID_IAM_INIT_ERROR = 'ID::IAM_INIT_ERROR',
  ID_FETCH_CLAIMS_FAILED = 'ID::FETCH_CLAIMS_FAILED',
  ID_CREATE_CLAIM_FAILED = 'ID::CREATE_CLAIM_FAILED',
  ID_NO_DID = 'ID::NO_DID',
  ID_BALANCE_CHECK_FAILED = 'ID::BALANCE_CHECK_FAILED',
  ID_NO_BALANCE = 'ID::NO_BALANCE',
  ID_ALREADY_ENROLED = 'ID::ALREADY_ENROLED',
  ID_NOT_ENROLED = 'ID::NOT_ENROLED',

  // DSB ERRORS
  DSB_NOT_CONTROLLABLE = 'DSB::NOT_CONTROLLABLE',
  DSB_UNSUPPORTED_CONTROL_TYPE = 'DSB::UNSUPPORTED_CONTROL_TYPE',
  DSB_UNHEALTHY = 'DSB::UNHEALTHY',
  DSB_REQUEST_FAILED = 'DSB::REQUEST_FAILED',
  DSB_LOGIN_FAILED = 'DSB::LOGIN_FAILED',
  DSB_UNAUTHORIZED = 'DSB::UNAUTHORIZED',
  DSB_FORBIDDEN_RESOURCE = 'DSB::FORBIDDEN_RESOURCE',
  DSB_CHANNEL_UNAUTHORIZED = 'DSB::CHANNEL_UNAUTHORIZED',
  DSB_CHANNEL_NOT_FOUND = 'DSB::CHANNEL_NOT_FOUND',
  DSB_NO_SUBSCRIPTIONS = 'DSB::NO_SUBSCRIPTIONS',
  DSB_INVALID_PAYLOAD = 'DSB::INVALID_PAYLOAD',

  // PM2 ERRORS
  PM2_NOT_CONFIGURED = 'PM2::NOT_CONFIGURED',
  PM2_CONNECT_FAILED = 'PM2::CONNECT_FAILED',
  PM2_DISCONNECT_FAILED = 'PM2::DISCONNECT_FAILED',
  PM2_START_FAILED = 'PM2::START_FAILED',
  PM2_RESTART_FAILED = 'PM2::RESTART_FAILED',

  // WEB3 ERRORS
  WEB3_PROVIDER_ERROR = 'WEB3::PROVIDER_ERROR',

  // GENERAL ERRORS
  DISK_READ_FAILED = 'DISK_READ_FAILED',
  DISK_WRITE_FAILED = 'DISK_WRITE_FAILED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  BAD_REQUEST = 'BAD_REQUEST',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INVALID_FILE = 'INVALID_FILE',

  // SIGNATURE ERRORS
  SIGNATURE_CHECK_FAILED = 'SIG::CHECK_FAILED',
  SIGNATURE_DOES_NOT_MATCH = 'SIG::NO_MATCH'
}

export type ErrorBody = {
  code: ErrorCode
  reason?: string
  additionalInformation?: any
}

export type ErrorBodySerialized = {
  code: ErrorCode
  reason: string | null
  additionalInformation?: any
}

/**
 * Custom Error class with additional user information
 */
export class GatewayError extends Error {
  public readonly body: ErrorBody
  public readonly statusCode: HttpError

  constructor({
    code,
    reason,
    additionalInformation,
    statusCode
  }: {
    statusCode: HttpError
    code: ErrorCode
    reason?: string
    additionalInformation?: any
  }) {
    super(code)
    this.statusCode = statusCode
    this.body = {
      code,
      reason,
      additionalInformation
    }
  }

  public serialize(): ErrorBodySerialized {
    return {
      code: this.body.code,
      reason: this.body.reason ? this.body.reason : null,
      additionalInformation: this.body.additionalInformation ? this.body.additionalInformation : null
    }
  }
}

//
// IDENTITY ERRORS
//

export class NoPrivateKeyError extends GatewayError {
  constructor() {
    super({
      statusCode: HttpError.FORBIDDEN,
      code: ErrorCode.ID_NO_PRIVATE_KEY,
      reason: 'Gateway has no identity, please set private key first'
    })
  }
}

export class InvalidPrivateKeyError extends GatewayError {
  constructor() {
    super({
      statusCode: HttpError.BAD_REQUEST,
      code: ErrorCode.ID_INVALID_PRIVATE_KEY,
      reason: 'Must be 64 bytes secp256k1 private key'
    })
  }
}

export class NotEnroledError extends GatewayError {
  constructor() {
    super({
      statusCode: HttpError.FORBIDDEN,
      code: ErrorCode.ID_NOT_ENROLED,
      reason: 'Gateway identity has not enroled as DSB user yet'
    })
  }
}
export class AlreadyEnroledError extends GatewayError {
  constructor() {
    super({
      statusCode: 403,
      code: ErrorCode.ID_ALREADY_ENROLED,
      reason: 'Gateway identity has already been enroled, state restored'
    })
  }
}
export class NoBalanceError extends GatewayError {
  constructor() {
    super({
      statusCode: HttpError.UNPROCESSABLE_ENTITY,
      code: ErrorCode.ID_NO_BALANCE,
      reason: 'Gateway identity has no balance, use faucet to request funds'
    })
  }
}

export class BalanceCheckError extends GatewayError {
  constructor() {
    super({
      statusCode: HttpError.INTERNAL_SERVER_ERROR,
      code: ErrorCode.ID_BALANCE_CHECK_FAILED,
      reason: 'Failed to fetch balance, please check RPC node connection'
    })
  }
}

export class IAMInitError extends GatewayError {
  constructor() {
    super({
      statusCode: HttpError.INTERNAL_SERVER_ERROR,
      code: ErrorCode.ID_IAM_INIT_ERROR,
      reason: 'Fatal: Unable to initialize connection to IAM services'
    })
  }
}

export class NoDIDError extends GatewayError {
  constructor() {
    super({
      statusCode: HttpError.INTERNAL_SERVER_ERROR,
      code: ErrorCode.ID_NO_DID,
      reason: 'Fatal: Unable to resolve or create DID'
    })
  }
}

export class FetchClaimsError extends GatewayError {
  constructor() {
    super({
      statusCode: HttpError.INTERNAL_SERVER_ERROR,
      code: ErrorCode.ID_FETCH_CLAIMS_FAILED,
      reason: `Unable to fetch claims associated with DID`
    })
  }
}

export class CreateClaimError extends GatewayError {
  constructor(roleName: string) {
    super({
      statusCode: HttpError.INTERNAL_SERVER_ERROR,
      code: ErrorCode.ID_CREATE_CLAIM_FAILED,
      reason: `Unable to create claim for role ${roleName}`
    })
  }
}

//
// DSB ERRORS
//

export class DSBRequestError extends GatewayError {
  constructor(reason?: string) {
    super({
      statusCode: HttpError.BAD_GATEWAY,
      code: ErrorCode.DSB_REQUEST_FAILED,
      reason: `Could not make request to DSB Message Broker${reason ? `: ${reason}` : ''}`
    })
  }
}

export class DSBHealthError extends GatewayError {
  constructor(error: any) {
    super({
      statusCode: HttpError.SERVICE_UNAVAILABLE,
      code: ErrorCode.DSB_UNHEALTHY,
      reason: `The DSB Message Broker is running with issues`,
      additionalInformation: error
    })
  }
}

export class DSBPayloadError extends GatewayError {
  constructor(errorMessage: any[]) {
    const [reason, error] = errorMessage
    super({
      statusCode: HttpError.BAD_REQUEST,
      code: ErrorCode.DSB_INVALID_PAYLOAD,
      reason,
      additionalInformation: error
    })
  }
}

export class DSBLoginError extends GatewayError {
  constructor(reason: string) {
    super({
      statusCode: HttpError.UNAUTHORIZED,
      code: ErrorCode.DSB_LOGIN_FAILED,
      reason
    })
  }
}

export class DSBChannelNotFoundError extends GatewayError {
  constructor(reason: string) {
    super({
      statusCode: HttpError.NOT_FOUND,
      code: ErrorCode.DSB_CHANNEL_NOT_FOUND,
      reason
    })
  }
}

export class DSBChannelUnauthorizedError extends GatewayError {
  constructor(reason: string) {
    super({
      statusCode: HttpError.UNAUTHORIZED,
      code: ErrorCode.DSB_CHANNEL_UNAUTHORIZED,
      reason
    })
  }
}

export class DSBForbiddenError extends GatewayError {
  constructor(reason: string) {
    super({
      statusCode: HttpError.FORBIDDEN,
      code: ErrorCode.DSB_FORBIDDEN_RESOURCE,
      reason
    })
  }
}

//
// SIGNATURE ERRORS
//

export class SignatureCheckError extends GatewayError {
  constructor() {
    super({
      statusCode: HttpError.BAD_REQUEST,
      code: ErrorCode.SIGNATURE_CHECK_FAILED,
      reason: 'Unable to verify public key used to sign payload, please check signature format and try again'
    })
  }
}

//
// MISC ERRORS
//

export class DiskWriteError extends GatewayError {
  constructor(reason: string) {
    super({
      statusCode: HttpError.INTERNAL_SERVER_ERROR,
      code: ErrorCode.DISK_WRITE_FAILED,
      reason: `Failed to write to disk: ${reason}`
    })
  }
}

export class Web3ProviderError extends GatewayError {
  constructor() {
    super({
      statusCode: HttpError.INTERNAL_SERVER_ERROR,
      code: ErrorCode.WEB3_PROVIDER_ERROR,
      reason: `Could not connect to RPC node, please check connection`
    })
  }
}

export class BadRequestError extends GatewayError {
  constructor(reason: string) {
    super({
      statusCode: HttpError.BAD_REQUEST,
      code: ErrorCode.BAD_REQUEST,
      reason
    })
  }
}

export class UnknownError extends GatewayError {
  constructor(err: any) {
    super({
      statusCode: HttpError.INTERNAL_SERVER_ERROR,
      code: ErrorCode.UNKNOWN_ERROR,
      reason: err instanceof Error ? err.message : err
    })
  }
}
