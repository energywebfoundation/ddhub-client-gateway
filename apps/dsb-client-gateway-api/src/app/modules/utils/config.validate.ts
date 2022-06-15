import * as Joi from 'joi';
import {
  BASIC_ENVS,
  IAM_ENVS,
  OPEN_TELEMETRY_ENVS,
} from '@dsb-client-gateway/ddhub-client-gateway-env';
import { Logger } from '@nestjs/common';
import { API_ENVS } from '../../types/environment-variables';

export const getSchema = (): Joi.ObjectSchema => {
  return Joi.object()
    .concat(API_ENVS)
    .concat(BASIC_ENVS)
    .concat(OPEN_TELEMETRY_ENVS)
    .concat(IAM_ENVS);
};

export function configValidate(config: Record<string, unknown>) {
  const result = getSchema().validate(config, {
    allowUnknown: true,
  });

  if (result.error) {
    const logger = new Logger('ConfigValidateApi');

    logger.error(result.error.message);
    logger.error('Validation failed', JSON.stringify(result.error.details));

    throw new Error();
  }

  return result.value;
}
