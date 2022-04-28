import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  namespace: {
    fontSize: 14,
    lineHeight: '18px',
    fontWeight: 400,
    color: theme.palette.grey[200],
    fontFamily: theme.typography.body2.fontFamily,
    maxWidth: 212,
  },
}));
