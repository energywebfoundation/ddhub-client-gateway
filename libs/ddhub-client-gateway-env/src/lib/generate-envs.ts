import * as fs from 'fs';
import json2md from 'json2md';
import * as Joi from 'joi';

export const generateEnvs = (
  objectSchema: Joi.ObjectSchema,
  title: string,
  outputPath: string,
): void => {
  const schema = objectSchema.describe().keys;

  const tableRows = Object.entries(schema).reduce((acc, curr) => {
    const [key, value]: [string, any] = curr;

    const isDependency = !!value.matches?.[0].ref?.path?.[0];

    acc.push({
      KEY: key,
      TYPE: isDependency ? value.matches?.[0].then.type : value.type,
      DEFAULT: isDependency
        ? value.matches?.[0].then.flags.default || ''
        : value.flags?.default?.toString() ?? '',
      DESCRIPTION: value.flags?.description ?? '',
      ALLOWED_VALUES: value.allow?.toString() ?? '',
      DEPENDENCY: isDependency
        ? `${value.matches?.[0].ref?.path?.[0]} == ${value.matches?.[0].is.allow[1]}`
        : '',
    });

    return acc;
  }, []);

  const md = json2md([
    {
      h1: title,
    },
    {
      table: {
        rows: [...tableRows],
        headers: [
          'KEY',
          'TYPE',
          'DEFAULT',
          'DESCRIPTION',
          'ALLOWED_VALUES',
          'DEPENDENCY',
        ],
      },
    },
  ]);

  fs.writeFileSync(outputPath, md);
};
