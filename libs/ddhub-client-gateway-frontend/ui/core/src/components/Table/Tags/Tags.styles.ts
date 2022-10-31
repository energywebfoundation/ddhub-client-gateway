import { makeStyles } from 'tss-react/mui';
import { alpha, darken } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  chip: {
    background: alpha(theme.palette.primary.main, 0.12),
    height: 20,
    margin: 3,
  },
  chipLabel: {
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 400,
    letterSpacing: '0.4px',
    color: theme.palette.primary.main,
    fontFamily: theme.typography.body2.fontFamily,
  },
  chipMore: {
    background: theme.palette.primary.main,
    height: 20,
    borderRadius: 21,
    '&:hover': {
      backgroundColor: darken(theme.palette.primary.main, 0.2),
    },
  },
  chipLabelWhite: {
    color: theme.palette.common.white,
    fontWeight: 600,
  },
}));
