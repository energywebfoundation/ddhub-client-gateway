import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  root: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 405,
    color: theme.palette.text.primary,
    fontFamily: theme.typography.body2.fontFamily,
    letterSpacing: '0.4px',
    textTransform: 'capitalize',
  },
}));
