import { AVAILABLE_FIELDS } from './Create.effects';
import * as yup from 'yup';

export const getSchema = () =>
  yup.object().shape({
    [AVAILABLE_FIELDS.username]: yup
      .string()
      .required('Username is required')
      .matches(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric')
      .min(4, 'Username must be at least 4 characters')
      .max(50, 'Username cannot exceed 50 characters'),
    [AVAILABLE_FIELDS.role]: yup
      .string()
      .required('Role is required')
      .oneOf(['messaging', 'admin'])
      .default('messaging'),
    [AVAILABLE_FIELDS.password]: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(256, 'Password cannot exceed 256 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      ),
    [AVAILABLE_FIELDS.confirmPassword]: yup
      .string()
      .required('Confirm password is required')
      .oneOf([yup.ref('password')], 'Passwords do not match'),
  });
