import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  root: {
    marginBottom: 30,
  },
  title: {
    fontSize: 14,
    fontFamily: theme.typography.body2.fontFamily,
    color: theme.palette.common.white,
  },
  activeTitle: {
    color: theme.palette.primary.main,
  },
  icon: {
    background: alpha('#939393', 0.12),
    color: theme.palette.common.white,
  },
  activeIcon: {
    background: theme.palette.primary.main,
  },
  subtitle: {
    color: theme.palette.grey[300],
    fontSize: 12,
  },
}));
