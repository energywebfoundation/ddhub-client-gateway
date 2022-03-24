import { plainToClass } from 'class-transformer';
import { EnvironmentVariables } from '../../types/environment-variables';
import { validateSync } from 'class-validator';

export function configValidate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    // throw new Error(errors.toString());
  }
  return validatedConfig;
}
