import { makeStyles } from 'tss-react/mui';
import { lighten } from '@mui/material/styles';

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
    wordBreak: 'break-all',
  },
  row: {
    marginBottom: 16,
  },
}));
