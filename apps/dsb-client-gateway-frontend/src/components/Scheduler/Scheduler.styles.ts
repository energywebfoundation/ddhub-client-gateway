import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  card: {
    boxShadow: 'none',
    minHeight: 206,
  },
  cardHeader: {
    padding: 0,
    fontSize: 18,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.text.primary,
    fontFamily: theme.typography.body2.fontFamily,
    letterSpacing: '0.4px',
    marginBottom: 22,
  },
  centerIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
