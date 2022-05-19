import { makeStyles } from 'tss-react/mui';
import { darken } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  text: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.grey[200],
  },
  chip: {
    background: theme.palette.primary.main,
    height: 20,
    borderRadius: 21,
    '&:hover': {
      backgroundColor: darken(theme.palette.primary.main, 0.2),
    },
  },
  chipLabel: {
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 600,
    letterSpacing: '0.4px',
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
  },
}));
