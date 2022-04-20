import * as yup from 'yup';

export const validationSchema = yup
  .object({
    name: yup.string().required(),
    schema: yup.string().required(),
    schemaType: yup.string().required(),
    tags: yup.array().min(1).required(),
    version: yup.string().required(),
  })
  .required();
