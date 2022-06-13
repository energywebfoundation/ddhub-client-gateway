import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';
import { WebSocketImplementation } from '../modules/message/message.const';
import { EventEmitMode } from '../modules/message/service/message.service';
import { Transform } from 'class-transformer';
import { SecretsEngine } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';

export enum NODE_ENV {
  Production = 'production',
  Development = 'development',
  Test = 'test',
}

export enum OpenTelemetryExporters {
  ZIPKIN = 'ZIPKIN',
}

export class EnvironmentVariables {
  @IsString()
  @IsEnum(NODE_ENV)
  NODE_ENV: NODE_ENV;

  @IsNumber()
  @Transform(EnvironmentVariables.transformNumber('PORT'))
  PORT = 3333;

  @IsString()
  RPC_URL = 'https://volta-rpc.energyweb.org/';

  @IsString()
  DSB_BASE_URL = 'https://dsb-demo.energyweb.org';

  @IsEnum(WebSocketImplementation)
  WEBSOCKET = WebSocketImplementation.NONE;

  @IsString()
  CLIENT_ID = 'WS-CONSUMER';

  @IsPositive()
  EVENTS_MAX_PER_SECOND = 2;

  @IsString()
  PARENT_NAMESPACE = 'dsb.apps.energyweb.iam.ewc';

  @IsString()
  EVENT_SERVER_URL = 'identityevents-dev.energyweb.org';

  @IsString()
  NATS_ENV_NAME = 'ewf-dev';

  @IsPositive()
  @Transform(EnvironmentVariables.transformNumber('CHAIN_ID'))
  CHAIN_ID = 73799;

  @IsString()
  CACHE_SERVER_URL = 'https://identitycache-dev.energyweb.org/v1';

  @IsString()
  CLAIM_MANAGER_ADDRESS = '0x5339adE9332A604A1c957B9bC1C6eee0Bcf7a031';

  @IsEnum(EventEmitMode)
  @ValidateIf(EnvironmentVariables.isWebsocketEnabled)
  EVENTS_EMIT_MODE = EventEmitMode.BULK;

  @IsPositive()
  @Transform(EnvironmentVariables.transformNumber('DID_TTL'))
  DID_TTL = 60; // seconds

  @IsString()
  @ValidateIf(EnvironmentVariables.isClientWebSocketEnabled)
  WEBSOCKET_URL: string;

  @IsString()
  @ValidateIf(EnvironmentVariables.isClientWebSocketEnabled)
  WEBSOCKET_PROTOCOL = 'dsb-protocol';

  @IsPositive()
  @ValidateIf(EnvironmentVariables.isClientWebSocketEnabled)
  WEBSOCKET_RECONNECT_TIMEOUT = 5000;

  @Transform(EnvironmentVariables.transformBoolean('WEBSOCKET_RECONNECT'))
  @ValidateIf(EnvironmentVariables.isClientWebSocketEnabled)
  WEBSOCKET_RECONNECT = true;

  @IsPositive()
  @ValidateIf(EnvironmentVariables.isClientWebSocketEnabled)
  WEBSOCKET_RECONNECT_MAX_RETRIES = 10;

  @IsNumber()
  @Transform(EnvironmentVariables.transformNumber('WEBSOCKET_POOLING_TIMEOUT'))
  WEBSOCKET_POOLING_TIMEOUT = 5000;

  @IsEnum(SecretsEngine)
  SECRETS_ENGINE = SecretsEngine.VAULT;

  @IsString()
  @ValidateIf(EnvironmentVariables.isVaultEnabled)
  VAULT_ENDPOINT;

  @IsString()
  @ValidateIf(EnvironmentVariables.isVaultEnabled)
  VAULT_TOKEN = 'root';

  @IsString()
  @ValidateIf(EnvironmentVariables.isVaultEnabled)
  VAULT_SECRET_PREFIX = 'ddhub/';

  @IsString()
  @ValidateIf(EnvironmentVariables.isAWSSecretsManagerEnabled)
  AWS_REGION = 'us-west-2';

  @IsString()
  @ValidateIf(EnvironmentVariables.isAWSSecretsManagerEnabled)
  AWS_SECRET_PREFIX = '/ddhub/';

  @IsString()
  @IsOptional()
  USERNAME: string;

  @IsString()
  @IsOptional()
  PASSWORD: string;

  @IsPositive()
  @IsOptional()
  MAX_RETRIES = 3;

  @IsPositive()
  @IsOptional()
  RETRY_FACTOR = 2;

  @IsPositive()
  @IsOptional()
  TIMEOUT = 1000;

  @IsBoolean()
  @Transform(EnvironmentVariables.transformBoolean('SCHEDULED_JOBS'))
  SCHEDULED_JOBS = false;

  @IsString()
  DID_CLAIM_NAMESPACE = 'message.broker.app.namespace';

  @IsNumber()
  @Transform(EnvironmentVariables.transformNumber('MAX_FILE_SIZE'))
  MAX_FILE_SIZE = 100000000;

  @IsString()
  SYMMETRIC_KEY_CLIENT_ID = 'test';

  @IsPositive()
  @IsNumber()
  @Transform(
    EnvironmentVariables.transformNumber('AMOUNT_OF_SYMMETRIC_KEYS_FETCHED')
  )
  AMOUNT_OF_SYMMETRIC_KEYS_FETCHED = 100;

  @IsBoolean()
  @Transform(EnvironmentVariables.transformBoolean('OPENTELEMETRY_ENABLED'))
  OPENTELEMETRY_ENABLED = false;

  @IsString()
  @ValidateIf(EnvironmentVariables.isOTELEnabled)
  OTEL_IGNORED_ROUTES = 'health,api/v2/health';

  @IsString()
  @ValidateIf(EnvironmentVariables.isOTELEnabled)
  OTEL_TRACING_URL = 'http://localhost:4318/v1/traces';

  @IsString()
  @ValidateIf(EnvironmentVariables.isOTELEnabled)
  OTEL_SERVICE_NAME = 'ddhub-client-gateway';

  @IsString()
  @ValidateIf(EnvironmentVariables.isOTELEnabled)
  OTEL_ENVIRONMENT = 'local';

  @IsString()
  APPLICATION_NAMESPACE_REGULAR_EXPRESSION = '\\w.apps.*\\w.iam.ewc';

  @IsString()
  DB_NAME = 'local.db';

  @IsString()
  REQUEST_BODY_SIZE = '50mb';

  static isOTELEnabled(values: EnvironmentVariables): boolean {
    return values.OPENTELEMETRY_ENABLED;
  }

  static isVaultEnabled(values: EnvironmentVariables): boolean {
    return values.SECRETS_ENGINE === SecretsEngine.VAULT;
  }

  static isAWSSecretsManagerEnabled(values: EnvironmentVariables): boolean {
    return values.SECRETS_ENGINE === SecretsEngine.AWS;
  }

  static isClientWebSocketEnabled(values: EnvironmentVariables): boolean {
    return values.WEBSOCKET === WebSocketImplementation.CLIENT;
  }

  static isWebsocketEnabled(values: EnvironmentVariables): boolean {
    return values.WEBSOCKET !== WebSocketImplementation.NONE;
  }

  static transformNumber(
    paramKey: string
  ): ({ obj }: { obj: EnvironmentVariables }) => number {
    return ({ obj }) => {
      return +obj[paramKey];
    };
  }

  static transformBoolean(
    paramKey: string
  ): ({ obj }: { obj: EnvironmentVariables }) => boolean {
    return ({ obj }) => {
      return [true, 'true'].indexOf(obj[paramKey]) > -1;
    };
  }
}
