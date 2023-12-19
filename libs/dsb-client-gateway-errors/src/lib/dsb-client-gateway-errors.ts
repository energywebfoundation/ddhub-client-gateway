export enum DsbClientGatewayErrors {
  // UNKNOWN
  UNKNOWN = 'DHCG::UNKNOWN',
  UNAUTHORIZED = 'DHCG::UNAUTHORIZED',
  ROUTE_NOT_FOUND = 'DHCG::ROUTE_NOT_FOUND',

  // IDENTITY ERRORS
  ID_NO_PRIVATE_KEY = 'ID::NO_PRIVATE_KEY',
  ID_IAM_INIT_ERROR = 'ID::IAM_INIT_ERROR',
  ID_NO_BALANCE = 'ID::NO_BALANCE',
  ID_INVALID_PRIVATE_KEY = 'ID::INVALID_PRIVATE_KEY',

  // IAM ERRORS
  IAM_NOT_INITIALIZED = 'IAM::NOT_INITIALIZED',

  // BIP39 ERRORS
  BIP39_MNEMONIC_DOES_NOT_EXISTS = 'BIP39::MNEMONIC_DOES_NOT_EXISTS',
  BIP39_ASSOCIATION_KEY_NOT_AVAILABLE = 'BIP39::ASSOCIATION_KEY_NOT_AVAILABLE',

  // MESSAGE BROKER ERRORS
  MB_UNABLE_TO_LOGIN = 'MB::UNABLE_TO_LOGIN',
  MB_ERROR = 'MB::ERROR',
  MB_UNKNOWN = 'MB::UNKNOWN',
  MB_ACK_PENDING = 'MB::ACK_PENDING',

  // Channel errors

  CHANNEL_ALREADY_EXISTS = 'CHANNEL::ALREADY_EXISTS',
  CHANNEL_NOT_FOUND = 'CHANNEL::NOT_FOUND',
  CHANNEL_RESTRICTED_FIELDS_UPDATE = 'CHANNEL::RESTRICTED_FIELDS_UPDATE',
  CHANNEL_TYPE_INVALID = 'CHANNEL::TYPE_INVALID',
  CHANNEL_TOPIC_SCHEMA_TYPE_INVALID = 'CHANNEL::CHANNEL_TOPIC_SCHEMA_TYPE_INVALID',
  CHANNEL_MESSAGE_FORMS_ONLY = 'CHANNEL::MESSAGE_FORMS_ONLY',

  // Topic errors

  TOPIC_NOT_FOUND = 'TOPIC::NOT_FOUND',
  TOPIC_NOT_RELATED_TO_CHANNEL = 'TOPIC::NOT_RELATED_TO_CHANNEL',

  // DSB ERRORS
  DSB_NOT_CONTROLLABLE = 'DDHUB::NOT_CONTROLLABLE',
  DSB_UNSUPPORTED_CONTROL_TYPE = 'DDHUB::UNSUPPORTED_CONTROL_TYPE',
  DSB_UNHEALTHY = 'DDHUB::UNHEALTHY',
  DSB_REQUEST_FAILED = 'DDHUB::REQUEST_FAILED',
  DSB_LOGIN_FAILED = 'DDHUB::LOGIN_FAILED',
  DSB_UNAUTHORIZED = 'DDHUB::UNAUTHORIZED',
  DSB_FORBIDDEN_RESOURCE = 'DDHUB::FORBIDDEN_RESOURCE',
  DSB_CHANNEL_UNAUTHORIZED = 'DDHUB::CHANNEL_UNAUTHORIZED',
  DSB_CHANNEL_NOT_FOUND = 'DDHUB::CHANNEL_NOT_FOUND',
  DSB_NO_SUBSCRIPTIONS = 'DDHUB::NO_SUBSCRIPTIONS',
  GW_INVALID_PAYLOAD = 'DDHUB::INVALID_PAYLOAD',

  SIGNATURE_DOES_NOT_MATCH = 'SIG::NO_MATCH',

  // Messaging ERRORS
  REQ_LOCK = 'MESSAGING::REQ_LOCK',
  RECIPIENTS_NOT_PRESENT = 'MESSAGING::RECIPIENTS_NOT_PRESENT',
  MESSAGES_NOT_PRESENT = 'MESSAGING::MESSAGES_NOT_PRESENT',
  TOPIC_OWNER_AND_NAME_REQUIRED = 'MESSAGING::TOPIC_OWNER_AND_NAME_REQUIRED',
  MESSAGE_DECRYPTION_FAILED = 'MESSAGING::DESCRPTION_FAILED',
  MESSAGE_PAYLOAD_NOT_PARSED = 'MESSAGING::PAYLOAD JSON PARSE FAILED',
  MAXIMUM_NUMBER_OF_CLIENTS_REACHED = 'MESSAGING:MAXIMUM_NUMBER_OF_CLIENTS_REACHED',
  //File upload errors

  FILE_SIZE_GREATER_THEN_100_MB = 'MESSAGING::FILE_SIZE_GREATER_THEN_100_MB',
  FILE_TYPE_NOT_MATCHED = 'MESSAGING::FILE_TYPE_NOT_MATCHED',
  FILE_NOT_FOUND = 'MESSAGING::FILE_NOT_FOUND',
  FILE_NAME_INVALID = 'MESSAGING::FILE_NAME_INVALID',

  // Secrets engine errors
  SECRETS_ENGINE_INVALID = 'SECRETS_ENGINE::INVALID',

  // Validation errors
  VALIDATION_FAILED = 'VALIDATION::FAILED',

  // Contact errors
  CONTACT_NOT_FOUND = 'CONTACT::NOT_FOUND',
}

export const DsbMessageBrokerErrors = {
  10: 'UNAUTHORIZE ACCESS',
  12: 'OWNER: VALIDATION FAILED',
  13: 'SCHEMA VALIDATION FAILED',
  14: 'REQUIRED TO SET LIMIT WITH PAGE > 1',
  15: 'CANNOT PARSE JSON',
  16: 'RELATED JAVA: ILLEGALARGUMENTEXCEPTION VALIDATION',
  17: 'RELATED PARAMETER VALIDATION',
  20: 'RELATED TO NATS JETSTREAM EXCEPTION',
  21: 'FQCN NOT EXISTS',
  30: 'RELATED TO CAMEL EXCEPTION',
  40: 'RELATED TO AZURE STORAGE EXCEPTION',
  50: 'RELATED TO MONGODB EXCEPTION',
  51: 'RELATED DUPLICATION',
  60: 'RELATED TO GENERAL SERVER EXCEPTION',
};
