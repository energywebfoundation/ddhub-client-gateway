import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  button: {
    height: 37,
    minWidth: 87,
    textTransform: 'capitalize',
    padding: '10px 22px',
    justifyContent: 'center',
    border: `1px solid ${theme.palette.secondary.main}`,
    margin: '0 16px 0 auto',
    '&:hover': {
      border: `1px solid ${theme.palette.secondary.main}`,
      background: alpha(theme.palette.secondary.main, 0.04),
    },
  },
  buttonText: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.secondary.main,
    fontFamily: theme.typography.body2.fontFamily,
  },
}));
