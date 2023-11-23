import { makeStyles } from 'tss-react/mui';
import { alpha, darken } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  root: {
    padding: 4,
    marginBottom: 29,
    borderRadius: 5,
    transition: 'opacity 0.3s ease-in-out',
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
    borderRadius: 6,
  },
  activeIcon: {
    '&.MuiAvatar-root': {
      background: theme.palette.primary.main,
    },
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
    paddingLeft: '12px',
    paddingRight: 'unset',
  },
  clickableDiv: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
      '& .MuiTypography-h6': {
        color: theme.palette.primary.main,
      },
    },
  },
  disabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
}));
