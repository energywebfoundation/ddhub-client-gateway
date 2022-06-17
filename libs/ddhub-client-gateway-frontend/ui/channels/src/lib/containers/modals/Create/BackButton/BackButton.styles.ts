import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material';

export const useStyles = makeStyles()((theme) => ({
  button: {
    height: 37,
    minWidth: 77,
    textTransform: 'capitalize',
    padding: '11px 22px',
    justifyContent: 'flex-start',
    border: `1px solid ${theme.palette.primary.main}`,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
      border: `1px solid ${theme.palette.primary.main}`,
    },
  },
  buttonText: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.primary.main,
    fontFamily: theme.typography.body2.fontFamily,
  },
}));
