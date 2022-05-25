import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  button: {
    fontFamily: theme.typography.body2.fontFamily,
    textTransform: 'capitalize',
    fontWeight: 400,
    letterSpacing: '0.4px',
  },
}));
