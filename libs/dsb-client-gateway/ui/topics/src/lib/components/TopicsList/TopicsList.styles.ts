import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  connectionStatus: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 2rem'
  },
  chip: {
    background: alpha(theme.palette.primary.main, 0.12),
    height: 20,
    margin: 3
  },
  chipLabel: {
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 400,
    letterSpacing: '0.4px',
    color: theme.palette.primary.main,
    fontFamily: theme.typography.body2.fontFamily,
  },
}));
