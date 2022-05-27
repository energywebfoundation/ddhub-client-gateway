import { darken, lighten } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  highlight: {
    color: theme.palette.primary.main,
  },
  container: {
    padding: '0 42px',
  },
  mainLabel: {
    fontFamily: theme.typography.body1.fontFamily,
    fontWeight: 400,
    fontSize: '26px',
    lineHeight: '31px',
    paddingBottom: '6px',
  },
  submitBtn: {
    textTransform: 'none',
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: darken(theme.palette.primary.main, 0.2),
    },
  },
  submitBtnText: {
    fontFamily: theme.typography.body2.fontFamily,
    fontWeight: 400,
    letterSpacing: '0.4px',
  },
  inputWrapper: {
    marginTop: 31,
    '& .MuiFormControl-root': {
      background: theme.palette.background.paper,
    },
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      border: `1px solid ${lighten(theme.palette.background.paper, 0.17)}`,
    },
  },
}));
