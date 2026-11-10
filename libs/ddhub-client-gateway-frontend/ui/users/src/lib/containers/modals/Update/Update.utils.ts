import {
  CHANGE_PASSWORD_AVAILABLE_FIELDS,
  VERIFY_PASSWORD_AVAILABLE_FIELDS,
} from './Update.effects';
import * as yup from 'yup';

export const getChangePasswordSchema = () =>
  yup.object().shape({
    [CHANGE_PASSWORD_AVAILABLE_FIELDS.newPassword]: yup
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
    [CHANGE_PASSWORD_AVAILABLE_FIELDS.confirmPassword]: yup
      .string()
      .required('Confirm password is required')
      .oneOf([yup.ref('newPassword')], 'Passwords do not match'),
  });

export const getVerifyPasswordSchema = () =>
  yup.object().shape({
    [VERIFY_PASSWORD_AVAILABLE_FIELDS.password]: yup
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
  });
