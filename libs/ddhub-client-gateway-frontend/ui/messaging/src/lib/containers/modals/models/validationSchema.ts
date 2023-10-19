import * as yup from 'yup';

const message = yup.lazy((value) => {
  switch (typeof value) {
    case 'object':
      if (!Array.isArray(value)) {
        return yup.object().required();
      } else {
        return yup.array(yup.object()).required();
      }
    default:
      return yup.mixed().required();
  }
});

export const validationSchema = yup
  .object({
    Channel: yup.string().required(),
    'Topic Name': yup.string().required(),
    Version: yup.string().required(),
    'Transaction ID': yup.string().required(),
    Message: message,
  })
  .required();
