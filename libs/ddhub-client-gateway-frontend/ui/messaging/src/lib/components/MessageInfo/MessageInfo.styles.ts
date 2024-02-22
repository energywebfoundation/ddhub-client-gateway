import { makeStyles } from 'tss-react/mui';
import { alpha, lighten } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  root: {
    background: lighten(theme.palette.background.paper, 0.07),
    boxShadow: 'none',
    width: 260,
    minHeight: 243,
  },
  card: {
    padding: '22px 23px',
  },
  heading: {
    fontSize: 16,
    lineHeight: '24px',
    marginBottom: 8,
    color: theme.palette.common.white,
    letterSpacing: '0.4px',
    fontFamily: theme.typography.body2.fontFamily,
  },
  divider: {
    borderColor: alpha(theme.palette.grey[600], 0.35),
    margin: '8px 0',
  },
  title: {
    fontSize: 14,
    lineHeight: '24px',
    color: theme.palette.common.white,
    letterSpacing: '0.4px',
    fontFamily: theme.typography.body2.fontFamily,
  },
  subTitle: {
    fontSize: 12,
    lineHeight: '14px',
    color: theme.palette.grey[400],
    letterSpacing: '0.4px',
    fontFamily: theme.typography.body2.fontFamily,
    maxWidth: 190,
  },
  monospace: {
    fontFamily: 'Source Code Pro',
  },
  row: {
    marginBottom: 16,
  },
}));
