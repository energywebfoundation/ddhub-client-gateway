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
