import * as yup from 'yup';

export const validationSchema = yup
  .object({
    name: yup.string().required(),
    schemaType: yup.string().required(),
    tags: yup.array().optional(),
    version: yup.string().required(),
    schema: yup.string().required(),
  })
  .required();
