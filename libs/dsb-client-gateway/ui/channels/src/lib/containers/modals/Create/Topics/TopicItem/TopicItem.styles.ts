import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  name: {
    fontSize: 14,
    fontFamily: theme.typography.body2.fontFamily,
  },
  version: {
    fontSize: 10,
    fontFamily: theme.typography.body2.fontFamily,
  },
}));
