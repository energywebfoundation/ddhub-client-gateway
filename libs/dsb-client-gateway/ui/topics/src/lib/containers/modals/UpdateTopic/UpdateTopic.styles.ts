import { makeStyles } from 'tss-react/mui';
import { alpha, darken } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  root: {
    '& .MuiBackdrop-root': {
      transition: 'none !important'
    }
  },
  paper: {
    maxWidth: 756,
    minHeight: 633,
    padding: '37px 43px 32px 32px',
    borderRadius: 6
  },
  container: {
    transition: 'none !important'
  },
  title: {
    fontSize: 23,
    lineHeight: '34px',
    fontWeight: 400,
    fontFamily: theme.typography.body1.fontFamily,
    color: theme.palette.common.white,
    padding: 0,
    marginBottom: 8,
    textAlign: 'center'
  },
  subTitle: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    textAlign: 'center',
    color: theme.palette.grey[400],
    fontFamily: theme.typography.body2.fontFamily,
  },
  closeButtonWrapper: {
    position: 'absolute',
    top: 17,
    right: 18
  },
  button: {
    padding: '10px 22px',
    borderRadius: 5
  },
  cancelButton: {
   border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
   marginRight: 7,
  },
  confirmButton: {
    width: 75,
    border: `1px solid ${theme.palette.primary.main}`,
    '&:hover': {
      backgroundColor: darken(theme.palette.primary.main, 0.2),
    }
  },
  buttonProgress: {
    color: theme.palette.common.white,
  },
  cancelButtonText: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.secondary.main,
    textTransform: 'capitalize'
  },
  submitButtonText: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.common.white,
    textTransform: 'capitalize'
  },
  actions: {
    padding: 0,
    marginTop: 10
  },
  appImage: {
    width: 49,
    height: 49
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
  }
}));
