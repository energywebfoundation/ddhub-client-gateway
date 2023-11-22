import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  heading: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
    fontSize: 40,
    color: theme.palette.warning.main,
  },
  button: {
    height: 37,
    minWidth: 87,
    textTransform: 'capitalize',
    padding: '10px 22px',
    justifyContent: 'center',
    border: `1px solid ${theme.palette.common.white}`,
    margin: '16px 16px 0 auto',
    '&:hover': {
      border: `1px solid ${theme.palette.common.white}`,
      background: alpha(theme.palette.common.white, 0.04),
    },
  },
  buttonText: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
  },
}));
