import { makeStyles } from 'tss-react/mui';
import { alpha, darken } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  paper: {
    maxWidth: 860,
    minHeight: 693,
    padding: '48px 40px 40px 48px',
    borderRadius: 0,
  },
  closeButtonWrapper: {
    position: 'absolute',
    top: 17,
    right: 18,
  },
  button: {
    padding: '10px 22px',
    borderRadius: 5,
  },
  cancelButton: {
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    marginRight: 7,
    '&:hover': {
      border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
      background: alpha(theme.palette.secondary.main, 0.04),
    },
  },
  confirmButton: {
    width: 75,
    '&:not(.Mui-disabled)': {
      border: `1px solid ${theme.palette.primary.main}`,
    },
    '&:hover': {
      backgroundColor: darken(theme.palette.primary.main, 0.2),
      boxShadow: `0px 0px 10px ${alpha(theme.palette.primary.main, 0.65)}`,
    },
  },
  buttonProgress: {
    color: theme.palette.common.white,
  },
  cancelButtonText: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.secondary.main,
    textTransform: 'capitalize',
  },
  submitButtonText: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.common.white,
    textTransform: 'capitalize',
  },
  actions: {
    padding: 0,
    marginTop: 2,
  },
  appImage: {
    width: 49,
    height: 49,
  },
  label: {
    fontSize: 12,
    lineHeight: '24px',
    fontWeight: 400,
    color: theme.palette.common.white,
  },
  value: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    color: theme.palette.grey[400],
  },
  progress: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    position: 'absolute',
  },
}));
