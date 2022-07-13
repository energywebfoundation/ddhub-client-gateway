import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  card: {
    padding: '32px 21px 24px 21px',
    boxShadow: 'none',
    height: 'auto'
  },
  mailIcon: {
    stroke: theme.palette.secondary.main,
  },
  avatar: {
    backgroundColor: alpha(theme.palette.secondary.main, 0.12),
    width: 46,
    height: 46,
    marginRight: 3,
  },
  status: {
    color: theme.palette.success.main,
    backgroundColor: alpha(theme.palette.success.main, 0.12),
    padding: '1px 4px',
    marginLeft: '16px',
    fontSize: 12,
    lineHeight: '18px',
    borderRadius: '4px',
  },
  title: {
    fontSize: 24,
    lineHeight: '28px',
    fontWeight: 400,
    color: theme.palette.text.primary,
    fontFamily: theme.typography.body2.fontFamily,
    letterSpacing: '0.4px',
  },
  label: {
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 400,
    color: theme.palette.grey[300],
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    marginRight: 7,
  },
  value: {
    fontSize: 12,
    lineHeight: '18px',
    color: theme.palette.grey[300],
    fontWeight: 400,
  },
  subtitle: {
    fontSize: 10,
    lineHeight: '18px',
    fontWeight: 400,
    margin: '7px 0 0 10px',
    color: theme.palette.text.primary,
  },
}));
