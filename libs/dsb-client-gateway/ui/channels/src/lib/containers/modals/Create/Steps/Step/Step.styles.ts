import { makeStyles } from 'tss-react/mui';
import { alpha, darken } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  root: {
    marginBottom: 29,
  },
  title: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    letterSpacing: '0.4px',
    fontFamily: theme.typography.body2.fontFamily,
    color: theme.palette.common.white,
  },
  activeTitle: {
    color: theme.palette.primary.main,
  },
  icon: {
    background: alpha(darken(theme.palette.common.white, 0.42), 0.12),
    color: theme.palette.common.white,
    width: 38,
    height: 38,
    borderRadius: 6
  },
  activeIcon: {
    '&.MuiAvatar-root': {
      background: theme.palette.primary.main,
    }
  },
  subtitle: {
    color: theme.palette.grey[300],
    fontSize: 12,
    lineHeight: '18px',
    letterSpacing: '0.4px',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: '12px'
  }
}));
