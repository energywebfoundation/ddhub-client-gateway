import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentVariables } from '../types/environment-variables';

// @TODO - Copied from dsb-client-gateway-api, move it to some shared library
export function configValidate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
