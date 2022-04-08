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
  CLIENT_ID = 'WS_CONSUMER';

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

  @IsString()
  @ValidateIf(EnvironmentVariables.isClientWebSocketEnabled)
  WEBSOCKET_URL: string;

  @IsString()
  @ValidateIf(EnvironmentVariables.isClientWebSocketEnabled)
  WEBSOCKET_PROTOCOL = 'dsb-protocol';

  @IsPositive()
  @ValidateIf(EnvironmentVariables.isClientWebSocketEnabled)
  WEBSOCKET_RECONNECT_TIMEOUT = 1000;

  @Transform(EnvironmentVariables.transformBoolean('WEBSOCKET_RECONNECT'))
  @ValidateIf(EnvironmentVariables.isClientWebSocketEnabled)
  WEBSOCKET_RECONNECT = true;

  @IsPositive()
  @ValidateIf(EnvironmentVariables.isClientWebSocketEnabled)
  WEBSOCKET_RECONNECT_MAX_RETRIES = 10;

  @IsEnum(SecretsEngine)
  SECRETS_ENGINE = SecretsEngine.VAULT;

  @IsString()
  @ValidateIf(EnvironmentVariables.isVaultEnabled)
  VAULT_ENDPOINT;

  @IsString()
  @ValidateIf(EnvironmentVariables.isVaultEnabled)
  VAULT_TOKEN = 'root';

  @IsString()
  @IsOptional()
  USERNAME: string;

  @IsString()
  @IsOptional()
  PASSWORD: string;

  @IsString()
  DID_AUTH_URL = 'http://localhost:8080';

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
  SCHEDULED_JOBS = true;

  @IsString()
  DID_CLAIM_NAMESPACE = 'message.broker.app.namespace';

  @IsNumber()
  @Transform(EnvironmentVariables.transformNumber('MAX_FILE_SIZE'))
  MAX_FILE_SIZE = 100000000;

  @IsString()
  FILES_DIRECTORY = '/../../../files/';

  @IsString()
  SYMMETRIC_KEY_CLIENT_ID = 'test';

  @IsPositive()
  @IsNumber()
  @Transform(
    EnvironmentVariables.transformNumber('AMOUNT_OF_SYMMETRIC_KEYS_FETCHED')
  )
  AMOUNT_OF_SYMMETRIC_KEYS_FETCHED = 100;

  @IsString()
  REFRESH_SYMMETRIC_KEY_CRON_TIME = '*/2 * * * * *';

  static isVaultEnabled(values: EnvironmentVariables): boolean {
    return values.SECRETS_ENGINE === SecretsEngine.VAULT;
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
